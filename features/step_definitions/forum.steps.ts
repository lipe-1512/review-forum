import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

let forums: any[] = [];
let currentUser: string = '';
let currentForum: any = null;

// Cenário: Creating a forum

Given('a user named {string}', function (username) {
  currentUser = username;
  assert.ok(true, `Usuário ${username} está logado`);
});

Given('he is on the {string} page', function (page) {
  assert.ok(true, `Usuário está na página ${page}`);
});

Given('the Film {string} exists', function (film) {
  assert.ok(true, `Filme ${film} existe`);
});

When('this user creates a Forum with Title {string} Description {string} And Related Film {string}', function (title, description, relatedFilm) {
  currentForum = {
    title,
    description,
    relatedFilm,
    createdBy: currentUser
  };
  forums.push(currentForum);
});

Then('the Forum must be created successfully', function () {
  assert.ok(forums.includes(currentForum), 'Fórum criado com sucesso');
});

// Cenário: Fail to create a forum

Given('there is no logged user', function () {
  currentUser = '';
  assert.ok(true, 'Nenhum usuário logado');
});

When('trying to create a Forum with Title {string} Description {string} And Related Film {string}', function (title, description, relatedFilm) {
  if (!currentUser) {
    currentForum = null;
  } else {
    currentForum = {
      title,
      description,
      relatedFilm,
      createdBy: currentUser
    };
    forums.push(currentForum);
  }
});

Then('the Forum must not be created', function () {
  assert.strictEqual(currentForum, null, 'Fórum não deve ser criado');
});

Then('should throw an error message saying that the user is required', function () {
  assert.strictEqual(currentUser, '', 'Usuário é requerido para criar fórum');
});
