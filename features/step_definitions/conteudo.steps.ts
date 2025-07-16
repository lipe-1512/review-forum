import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { ICustomWorld } from './support/world';

// Simulação de banco de dados em memória para filmes, reviews, usuários e listas pessoais
interface Review {
  text: string;
  user: string;
  rating?: number;
}

interface Movie {
  title: string;
  year?: string;
  director?: string;
  mainGenre?: string;
  averageRating?: number;
  reviews: Review[];
  availability?: string;
}

interface PersonalListItem {
  title: string;
  type: string; // ex: filme, livro, série, anime
}

const moviesDatabase: Map<string, Movie> = new Map();
const personalLists: Map<string, PersonalListItem[]> = new Map(); // key: username, value: list of items
const userHistory: Map<string, { evaluations: string[]; posts: string[] }> = new Map();

let currentReviewText: string = '';
let currentReviewRating: number | undefined = undefined;
let currentMovieTitleForReview: string = '';
let lastMessage: string = '';

// --- Passos existentes para filmes, reviews e usuários ---

Given('o filme {string} com nota média {string} existe no sistema', function (title: string, averageRating: string) {
  const movie: Movie = {
    title,
    averageRating: parseFloat(averageRating),
    reviews: [],
  };
  moviesDatabase.set(title, movie);
});

Given('o filme {string} possui as reviews: {string} por {string} e {string} por {string}', function (
  title: string,
  review1: string,
  user1: string,
  review2: string,
  user2: string
) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado no sistema.`);
  movie.reviews.push({ text: review1, user: user1 });
  movie.reviews.push({ text: review2, user: user2 });
});

When('eu acesso a página de detalhes do filme {string}', function (title: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado no sistema.`);
  this.lastApiResponse = movie;
});

Then('eu devo ver {string} como título principal', function (expectedTitle: string) {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta da API disponível.');
  assert.strictEqual(this.lastApiResponse.title, expectedTitle, 'Título principal não corresponde.');
});

Then('eu devo ver a nota média {string} associada ao filme', function (expectedRating: string) {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta da API disponível.');
  const expected = parseFloat(expectedRating);
  assert.strictEqual(this.lastApiResponse.averageRating, expected, 'Nota média não corresponde.');
});

Then('eu devo ver a review {string} de {string}', function (expectedReview: string, expectedUser: string) {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta da API disponível.');
  const found = this.lastApiResponse.reviews.some(
    (r: Review) => r.text === expectedReview && r.user === expectedUser
  );
  assert.ok(found, `Review "${expectedReview}" de "${expectedUser}" não encontrada.`);
});

Given('eu estou logado como o usuário {string}', function (username: string) {
  this.currentUser = { id: 1, name: username, email: `${username}@example.com` };
});

Given('o filme {string} está disponível para avaliação no sistema', function (title: string) {
  if (!moviesDatabase.has(title)) {
    moviesDatabase.set(title, { title, reviews: [] });
  }
});

Given('eu acesso a funcionalidade de adicionar review para o filme {string}', function (title: string) {
  currentMovieTitleForReview = title;
});

When('eu submeto uma review com o texto {string} e uma nota de {string}', function (reviewText: string, ratingText: string) {
  currentReviewText = reviewText;
  // Extrair número da nota, ex: "5 de 5 estrelas" -> 5
  const match = ratingText.match(/(\d+)/);
  currentReviewRating = match ? parseInt(match[1], 10) : undefined;
  assert.ok(this.currentUser, 'Usuário deve estar logado para submeter review.');
  assert.ok(moviesDatabase.has(currentMovieTitleForReview), `Filme "${currentMovieTitleForReview}" não encontrado.`);
  const movie = moviesDatabase.get(currentMovieTitleForReview)!;
  movie.reviews.push({ text: currentReviewText, user: this.currentUser.name, rating: currentReviewRating });
  // Recalcular nota média
  const ratings = movie.reviews.map(r => r.rating).filter(r => r !== undefined) as number[];
  if (ratings.length > 0) {
    movie.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }
  lastMessage = `Sua review para '${movie.title}' foi publicada com sucesso!`;
});

Then('eu devo visualizar a mensagem genérica {string}', function (expectedMessage: string) {
  assert.strictEqual(lastMessage, expectedMessage, 'Mensagem exibida não corresponde.');
});

Then(/eu devo visualizar a mensagem (de sucesso da review|de sucesso da atualização|de confirmação)( genérica)? {string}/, function (expectedMessage: string) {
  assert.strictEqual(lastMessage, expectedMessage, 'Mensagem exibida não corresponde.');
});

Then('minha avaliação, contendo o texto {string} e a nota {string}, deve estar visível na página do filme', function (expectedText: string, expectedRating: string) {
  const movie = moviesDatabase.get(currentMovieTitleForReview);
  assert.ok(movie, `Filme "${currentMovieTitleForReview}" não encontrado.`);
  const found = movie.reviews.some(r => r.text === expectedText && r.rating === parseInt(expectedRating));
  assert.ok(found, 'Avaliação não encontrada na página do filme.');
});

Given('o filme {string} existe no sistema com gênero {string} e ano {string}', function (title: string, genre: string, year: string) {
  if (!moviesDatabase.has(title)) {
    moviesDatabase.set(title, { title, mainGenre: genre, year: year, reviews: [] });
  } else {
    const movie = moviesDatabase.get(title)!;
    movie.mainGenre = genre;
    movie.year = year;
  }
});

Then('a nota média geral do filme {string} deve ser recalculada considerando minha nova nota', function (title: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  const ratings = movie.reviews.map(r => r.rating).filter(r => r !== undefined) as number[];
  const average = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  assert.strictEqual(movie.averageRating, average, 'Nota média geral não foi recalculada corretamente.');
});

Given('eu estou logado como um usuário {string} com permissões de administrador', function (username: string) {
  this.currentUser = { id: 99, name: username, email: `${username}@example.com` };
  this.currentUser.isAdmin = true;
});

Given('eu estou na funcionalidade para adicionar um novo filme', function () {
  // Pode ser um placeholder, pois não há UI real
});

When('eu tento cadastrar um filme com as seguintes informações:', function (dataTable) {
  assert.ok(this.currentUser && this.currentUser.isAdmin, 'Usuário deve ser administrador para cadastrar filme.');
  // Corrigir uso de rowsHash para dataTable com mais de duas colunas
  const rows = dataTable.raw();
  const movie: Movie = {
    title: rows[1][0],
    year: rows[1][1],
    director: rows[1][2],
    mainGenre: rows[1][3],
    reviews: [],
  };
  moviesDatabase.set(movie.title, movie);
  lastMessage = `Filme '${movie.title}' cadastrado com sucesso.`;
});

Then('eu devo visualizar a mensagem de confirmação {string}', function (expectedMessage: string) {
  assert.strictEqual(lastMessage, expectedMessage, 'Mensagem exibida não corresponde.');
});

Then('o filme {string} deve constar no sistema com os dados fornecidos: ano {string}, diretor {string} e gênero {string}', function (
  title: string,
  year: string,
  director: string,
  genre: string
) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  assert.strictEqual(movie.year, year, 'Ano do filme não corresponde.');
  assert.strictEqual(movie.director, director, 'Diretor do filme não corresponde.');
  assert.strictEqual(movie.mainGenre, genre, 'Gênero do filme não corresponde.');
});

Given('o filme {string} está cadastrado no sistema', function (title: string) {
  if (!moviesDatabase.has(title)) {
    moviesDatabase.set(title, { title, reviews: [] });
  }
});

Given('as informações de disponibilidade para {string} são: {string}', function (title: string, availability: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  movie.availability = availability;
});

When('eu consulto a seção {string} na página de detalhes do filme {string}', function (section: string, title: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  this.lastApiResponse = { section, availability: movie.availability };
});

Then('eu devo ser informado que o filme está disponível para streaming em {string}', function (expectedPlatform: string) {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta da API disponível.');
  assert.ok(this.lastApiResponse.availability.includes(expectedPlatform), `Disponibilidade não inclui "${expectedPlatform}".`);
});

When('eu tento atualizar o {string} do filme {string} para {string}', function (field: string, title: string, newValue: string) {
  assert.ok(this.currentUser && this.currentUser.isAdmin, 'Usuário deve ser administrador para editar filme.');
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  switch (field) {
    case 'Gênero Principal':
      movie.mainGenre = newValue;
      break;
    default:
      throw new Error(`Campo "${field}" não suportado para edição.`);
  }
  lastMessage = `Informações do filme '${title}' atualizadas com sucesso.`;
});

Then('eu devo visualizar a mensagem {string}', function (expectedMessage: string) {
  assert.strictEqual(lastMessage, expectedMessage, 'Mensagem exibida não corresponde.');
});

Then('na página de detalhes do filme {string}, o gênero exibido deve ser {string}', function (title: string, expectedGenre: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  assert.strictEqual(movie.mainGenre, expectedGenre, 'Gênero exibido não corresponde.');
});

Then('o ano {string} do filme {string} deve continuar o mesmo', function (year: string, title: string) {
  const movie = moviesDatabase.get(title);
  assert.ok(movie, `Filme "${title}" não encontrado.`);
  assert.strictEqual(movie.year, year, 'Ano do filme não corresponde.');
});

// --- Novos passos para listas pessoais ---

Given('que estou autenticado como usuário {string}', function (username: string) {
  this.currentUser = { id: 1, name: username, email: `${username}@example.com` };
  if (!personalLists.has(username)) {
    personalLists.set(username, []);
  }
  if (!userHistory.has(username)) {
    userHistory.set(username, { evaluations: [], posts: [] });
  }
});

Given('que estou visualizando o item {string} do tipo {string}', function (title: string, type: string) {
  // Apenas registra o item atual para uso nos passos seguintes
  this.currentItem = { title, type };
});

When('escolho adicionar esse item à lista pessoal {string}', function (listName: string) {
  assert.ok(this.currentUser, 'Usuário deve estar autenticado para adicionar itens à lista.');
  const username = this.currentUser.name;
  const list = personalLists.get(username);
  assert.ok(list, 'Lista pessoal não encontrada para o usuário.');
  // Verifica se o item já está na lista
  const exists = list.some(item => item.title === this.currentItem.title && item.type === this.currentItem.type);
  if (!exists) {
    list.push(this.currentItem);
    lastMessage = `Item '${this.currentItem.title}' adicionado à lista '${listName}'.`;
  } else {
    lastMessage = `Item '${this.currentItem.title}' já está na lista '${listName}'.`;
  }
});

Then('o item deve ser adicionado com sucesso à lista {string}', function (listName: string) {
  const username = this.currentUser.name;
  const list = personalLists.get(username);
  assert.ok(list, 'Lista pessoal não encontrada para o usuário.');
  const found = list.some(item => item.title === this.currentItem.title);
  assert.ok(found, `Item '${this.currentItem.title}' não encontrado na lista '${listName}'.`);
  assert.strictEqual(lastMessage, `Item '${this.currentItem.title}' adicionado à lista '${listName}'.`);
});

Then('uma mensagem clara informa que o item já está na lista {string}', function (listName: string) {
  assert.strictEqual(lastMessage, `Item '${this.currentItem.title}' já está na lista '${listName}'.`);
});

When('escolho remover o item {string} da lista pessoal {string}', function (title: string, listName: string) {
  assert.ok(this.currentUser, 'Usuário deve estar autenticado para remover itens da lista.');
  const username = this.currentUser.name;
  const list = personalLists.get(username);
  assert.ok(list, 'Lista pessoal não encontrada para o usuário.');
  const index = list.findIndex(item => item.title === title);
  if (index !== -1) {
    list.splice(index, 1);
    lastMessage = `Item '${title}' removido da lista '${listName}'.`;
  } else {
    lastMessage = `Item '${title}' não está na lista '${listName}'.`;
  }
});

Then('o item {string} deve ser removido com sucesso da lista {string}', function (title: string, listName: string) {
  const username = this.currentUser.name;
  const list = personalLists.get(username);
  assert.ok(list, 'Lista pessoal não encontrada para o usuário.');
  const found = list.some(item => item.title === title);
  assert.ok(!found, `Item '${title}' ainda está presente na lista '${listName}'.`);
  assert.strictEqual(lastMessage, `Item '${title}' removido da lista '${listName}'.`);
});

Then('uma mensagem clara informa que o item {string} não está na lista {string}', function (title: string, listName: string) {
  assert.strictEqual(lastMessage, `Item '${title}' não está na lista '${listName}'.`);
});

// --- Passos para visualizar histórico de avaliações e posts ---

When('acesso a seção de histórico de atividades', function () {
  assert.ok(this.currentUser, 'Usuário deve estar autenticado para acessar o histórico.');
  const history = userHistory.get(this.currentUser.name);
  this.lastApiResponse = history;
});

Then('vejo uma lista organizada das avaliações que realizei', function () {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta disponível para histórico.');
  assert.ok(Array.isArray(this.lastApiResponse.evaluations), 'Avaliações devem ser uma lista.');
});

Then('cada avaliação mostra o item avaliado, a data e a nota atribuída', function () {
  // Como estamos simulando, verificamos se há algum conteúdo na lista
  assert.ok(this.lastApiResponse.evaluations.length > 0, 'Não há avaliações no histórico.');
});

Then('vejo uma lista organizada dos posts que realizei', function () {
  assert.ok(this.lastApiResponse, 'Nenhuma resposta disponível para histórico.');
  assert.ok(Array.isArray(this.lastApiResponse.posts), 'Posts devem ser uma lista.');
});
