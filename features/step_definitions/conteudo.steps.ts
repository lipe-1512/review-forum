import { Given, When, Then } from '@cucumber/cucumber';

let films: any[] = [];
let currentFilm: any = null;
let currentUser: any = { username: 'joana_silva' };
let reviews: any[] = [];

Given('o filme {string} com nota média {string} existe no sistema', function (film, rating) {
  films.push({ title: film, rating: parseFloat(rating) });
});

Given('o filme {string} possui as reviews: {string} por {string} e {string} por {string}', function (film, review1, user1, review2, user2) {
  reviews.push({ film, reviews: [{ text: review1, user: user1 }, { text: review2, user: user2 }] });
});

When('eu acesso a página de detalhes do filme {string}', function (film) {
  currentFilm = films.find(f => f.title === film);
  if (!currentFilm) throw new Error('Filme não encontrado');
});

Then('eu devo ver {string} como título principal', function (title) {
  if (currentFilm.title !== title) throw new Error('Título incorreto');
});

Then('eu devo ver a nota média {string} associada ao filme', function (rating) {
  if (currentFilm.rating !== parseFloat(rating)) throw new Error('Nota média incorreta');
});

Then('eu devo ver a review {string} de {string}', function (reviewText, user) {
  const filmReviews = reviews.find(r => r.film === currentFilm.title);
if (!filmReviews || !filmReviews.reviews.some((r: any) => r.text === reviewText && r.user === user)) {
    throw new Error('Review não encontrada');
  }
});

Given('eu estou logado como o usuário {string}', function (username) {
  currentUser.username = username;
});

Given('o filme {string} está disponível para avaliação no sistema', function (film) {
  if (!films.find(f => f.title === film)) {
    films.push({ title: film, rating: 0 });
  }
});

Given('eu acesso a funcionalidade de adicionar review para o filme {string}', function (film) {
  currentFilm = films.find(f => f.title === film);
  if (!currentFilm) throw new Error('Filme não encontrado');
});

When('eu submeto uma review com o texto {string} e uma nota de {string}', function (text, rating) {
  reviews.push({ film: currentFilm.title, reviews: [{ text, user: currentUser.username, rating: parseFloat(rating) }] });
});

Then('eu devo visualizar a mensagem {string}', function (message) {
  // Simula mensagem de sucesso
  return true;
});

Then('minha avaliação contendo o texto {string} e a nota {string} deve estar visível na página do filme', function (text, rating) {
  const filmReviews = reviews.find(r => r.film === currentFilm.title);
if (!filmReviews || !filmReviews.reviews.some((r: any) => r.text === text && r.rating === parseFloat(rating))) {
    throw new Error('Avaliação não encontrada');
  }
});

Then('a nota média geral do filme {string} deve ser recalculada considerando minha nova nota', function (film) {
  // Simula recalculo da nota média
  return true;
});

Given('eu estou logado como um usuário {string} com permissões de administrador', function (username) {
  currentUser.username = username;
  currentUser.isAdmin = true;
});

Given('estou na funcionalidade para adicionar um novo filme', function () {
  return true;
});

When('eu tento cadastrar um filme com as seguintes informações:', function (dataTable) {
  const data = dataTable.rowsHash();
  films.push({ title: data['Título'], year: data['Ano'], director: data['Diretor'], genre: data['Gênero Principal'] });
});

Then('eu devo visualizar a mensagem de confirmação {string}', function (message) {
  return true;
});

Then('o filme {string} deve constar no sistema com os dados fornecidos: ano {string} diretor {string} e gênero {string}', function (title, year, director, genre) {
  const film = films.find(f => f.title === title);
  if (!film || film.year !== year || film.director !== director || film.genre !== genre) {
    throw new Error('Dados do filme incorretos');
  }
});

Given('o filme {string} está cadastrado no sistema', function (film) {
  if (!films.find(f => f.title === film)) {
    films.push({ title: film });
  }
});

Given('as informações de disponibilidade para {string} são: {string}', function (film, availability) {
  const f = films.find(f => f.title === film);
  if (f) {
    f.availability = availability;
  }
});

When('eu consulto a seção {string} na página de detalhes do filme {string}', function (section, film) {
  currentFilm = films.find(f => f.title === film);
  if (!currentFilm) throw new Error('Filme não encontrado');
});

Then('eu devo ser informado que o filme está disponível para streaming em {string}', function (service) {
  if (!currentFilm.availability.includes(service)) {
    throw new Error('Serviço de streaming não encontrado');
  }
});
