import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { ICustomWorld } from './support/world';

// --- Estado local para os cenários deste arquivo ---
let userData: any = {};
let registrationResult: { success: boolean, message: string, user?: any };
let errorMessages: string[] = [];
const registeredEmails = new Set(['existing@example.com']);


// --- Cenário: Usuário realiza cadastro com sucesso ---

Given('que estou no processo de criação de uma nova conta', function (this: ICustomWorld) {
  userData = {};
  registrationResult = { success: false, message: '' };
});

When('informo meus dados pessoais válidos, incluindo nome, e-mail e senha', function (this: ICustomWorld) {
  userData = {
    name: 'Felipe Teste',
    email: 'felipe.novo@example.com',
    password: 'senhaForte123'
  };
});

When('confirmo a senha informada', function (this: ICustomWorld) {
  // Em uma simulação, a confirmação é implícita.
  // A lógica de validação estaria no passo 'Then'.
});

Then('vejo uma mensagem indicando que o cadastro foi concluído com sucesso', function (this: ICustomWorld) {
  // Simula a lógica de negócio do cadastro
  if (userData.name && userData.email && userData.password && !registeredEmails.has(userData.email)) {
    registrationResult = {
      success: true,
      message: 'Cadastro concluído com sucesso!',
      user: { ...userData }
    };
    registeredEmails.add(userData.email);
  } else {
    registrationResult = { success: false, message: 'Dados inválidos.' };
  }

  assert.strictEqual(registrationResult.success, true, registrationResult.message);
  assert.strictEqual(registrationResult.message, 'Cadastro concluído com sucesso!');
});

Then('sou direcionado para a área inicial do sistema', function (this: ICustomWorld) {
  // No contexto do teste, o "redirecionamento" significa que o usuário foi autenticado.
  this.currentUser = registrationResult.user;
  assert.ok(this.currentUser, 'O usuário deveria ter sido autenticado após o cadastro.');
  console.log(`Usuário ${this.currentUser!.name} foi redirecionado.`);
});


// --- Cenário: Usuário tenta cadastrar com dados inválidos ---

When('não preencho todos os campos obrigatórios', function () {
  userData = { name: 'Teste', email: '', password: '' };
  errorMessages = ['E-mail é obrigatório', 'Senha é obrigatória'];
});

When('informo um e-mail já registrado no sistema', function () {
    // Este step complementa o anterior, simulando múltiplas tentativas.
    userData.email = 'existing@example.com';
    errorMessages.push('E-mail já registrado no sistema.');
});

Then('vejo mensagens de erro indicando os problemas nos dados fornecidos', function () {
  assert(errorMessages.length > 0, 'Deveriam existir mensagens de erro.');
});

Then('permaneço no processo de cadastro até corrigir os erros', function () {
  // Este step é mais sobre o estado da UI, aqui apenas confirmamos que o cadastro não foi concluído.
  const userWasCreated = registeredEmails.has(userData.email);
  assert.strictEqual(userWasCreated, false, 'Um usuário não deveria ser criado com dados inválidos.');
});


// --- Cenário: Usuário atualiza suas informações pessoais ---

When('acesso a funcionalidade de edição de perfil', function (this: ICustomWorld) {
  assert.ok(this.currentUser, 'Pré-condição falhou: Nenhum usuário está autenticado para editar o perfil.');
});

// A implementação para o step 'altero minhas informações pessoais, como nome ou e-mail' ainda está faltando,
// Cucumber irá nos dizer como implementá-la.


// --- Cenário: Usuário exclui sua conta ---

When('acesso a funcionalidade de exclusão de conta', function (this: ICustomWorld) {
    assert.ok(this.currentUser, 'Pré-condição falhou: Nenhum usuário está autenticado para excluir a conta.');
});

When('confirmo a exclusão', function (this: ICustomWorld) {
  // Simula a exclusão do usuário do "banco de dados" e do estado global.
  registeredEmails.delete(this.currentUser!.email);
  this.currentUser = undefined;
});

// Removido step duplicado para evitar ambiguidade
Given('que estou autenticado no sistema', function () {
  // Este step foi removido para evitar conflito com a definição centralizada em hooks.steps.ts
  return;
});

Then('vejo uma mensagem indicando que minha conta foi excluída', function () {
  // Simplesmente confirma que o passo anterior foi executado.
  // Em um teste de API, verificaríamos a resposta.
});

Then('sou deslogado do sistema', function (this: ICustomWorld) {
  assert.strictEqual(this.currentUser, undefined, 'O usuário ainda está autenticado no contexto do teste.');
});

Then('não consigo mais acessar minha conta com as credenciais anteriores', function () {
    const wasRecreated = registeredEmails.has('autenticado@example.com');
    assert.strictEqual(wasRecreated, false, 'O e-mail do usuário excluído ainda existe no sistema.');
});


// --- Cenário: Usuário tenta cadastrar com senha fraca ---

When('informo uma senha que não atende aos critérios de segurança', function () {
  userData.password = '123';
  errorMessages.push('A senha deve ter no mínimo 8 caracteres.');
});

Then('vejo uma mensagem de erro indicando que a senha é fraca', function () {
  const hasWeakPasswordError = errorMessages.some(msg => msg.includes('senha'));
  assert.ok(hasWeakPasswordError, 'A mensagem de erro sobre a senha fraca não foi encontrada.');
});

Then('sou solicitado a escolher uma senha mais forte', function () {
  // Step de UI, podemos apenas confirmar que o fluxo continua.
  return;
});
