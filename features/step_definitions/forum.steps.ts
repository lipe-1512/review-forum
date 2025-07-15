import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { ICustomWorld } from './support/world';

// Estado simulado para a feature de Fórum
const filmsDatabase = new Set<string>();
const forumsDatabase: any[] = [];
let forumData: any = {};
let errorMessage: string = '';

// --- Cenário: Creating a forum ---

Given('a user named {string}', function (this: ICustomWorld, username: string) {
  this.currentUser = { id: 2, name: username, email: `${username}@example.com` };
});

Given('he is on the {string} page', function (this: ICustomWorld, pageName: string) {
  assert.ok(this.currentUser, 'Um usuário precisa estar definido para estar em uma página');
});

Given('the Film {string} exists', function (filmName: string) {
  filmsDatabase.add(filmName);
});

When('this user creates a new forum with the Title {string}, Description {string} and Related Film {string}', function (this: ICustomWorld, title: string, description: string, relatedFilm: string) {
  assert.ok(this.currentUser, 'Usuário precisa estar logado para criar um fórum');
  assert.ok(filmsDatabase.has(relatedFilm), `O filme "${relatedFilm}" não existe no sistema.`);

  forumData = { title, description, relatedFilm, createdBy: this.currentUser.name };
  forumsDatabase.push(forumData);
});

Then('the Forum must be created successfully', function () {
  const createdForum = forumsDatabase.find(f => f.title === forumData.title && f.createdBy === forumData.createdBy);
  assert.ok(createdForum, 'O fórum não foi encontrado no banco de dados simulado.');
  assert.strictEqual(createdForum.description, forumData.description);
});


// --- Cenário: Fail to create a forum without a title ---

Given('a user with username {string}', function (this: ICustomWorld, username: string) {
  this.currentUser = { id: 3, name: username, email: `${username}@example.com` };
});

When('the user creates a Forum with no Title', function (this: ICustomWorld) {
    forumData = { title: '', description: 'Uma descrição qualquer.', relatedFilm: 'Sonic 3' };
    if (!forumData.title) {
        errorMessage = 'Title is required!';
    }
});

When('Related Film {string}', function (filmName: string) {
    // Este step pode ser usado para confirmar que o filme existe, se necessário
    assert.ok(filmsDatabase.has(filmName), `O filme "${filmName}" deveria existir.`);
});

Then('the forum should not be created', function () {
  const wasCreated = forumsDatabase.some(f => f.description === forumData.description);
  assert.strictEqual(wasCreated, false, 'O fórum foi criado indevidamente sem um título.');
});

Then('the user should see an error message {string}', function (expectedError: string) {
  assert.strictEqual(errorMessage, expectedError, 'A mensagem de erro não é a esperada.');
});


// --- Cenário: Fail to create a forum (usuário deslogado) ---

Given('there is no logged user', function (this: ICustomWorld) {
  this.currentUser = undefined;
});

When('trying to create a Forum with Title {string}, Description {string} And Related Film {string}', function (this: ICustomWorld, title: string, description: string, relatedFilm: string) {
  if (!this.currentUser) {
    errorMessage = 'User is required';
    forumData = null;
  } else {
    forumData = { title, description, relatedFilm, createdBy: this.currentUser.name };
    forumsDatabase.push(forumData);
  }
});

Then('the Forum must not be created', function () {
  assert.strictEqual(forumData, null, 'O fórum não deveria ter sido criado por um usuário deslogado.');
});

Then('should throw an error message saying that the user is required', function () {
  assert.strictEqual(errorMessage, 'User is required', 'A mensagem de erro não é a esperada.');
});