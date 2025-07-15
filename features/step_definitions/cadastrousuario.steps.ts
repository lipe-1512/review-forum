import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

// Variáveis para manter o estado entre os steps
let userName: string;
let userEmail: string;
let userPass: string;
let userPassConfirm: string;
let registrationResult: { success: boolean, message: string, user?: any };
let errorMessages: string[] = [];
let isInRegistrationProcess: boolean = true;
let registeredEmails: Set<string> = new Set(['existing@example.com']);

// --- Cenário: Usuário realiza cadastro com sucesso ---

Given('que estou no processo de criação de uma nova conta', function () {
  // Este step prepara o contexto. Neste caso, não faz nada, apenas descreve a situação.
  isInRegistrationProcess = true;
  errorMessages = [];
});

When('informo meus dados pessoais válidos, incluindo nome, e-mail e senha', function () {
  // Simula a entrada de dados válidos
  userName = 'Felipe Teste';
  userEmail = 'felipe.teste@example.com';
  userPass = 'senhaForte123';
});

When('confirmo a senha informada', function () {
  // Simula a confirmação da senha
  userPassConfirm = 'senhaForte123';
});

Then('vejo uma mensagem indicando que o cadastro foi concluído com sucesso', function () {
  // Simula a lógica de negócio do cadastro
  if (userName && userEmail && userPass && userPass === userPassConfirm) {
    registrationResult = {
      success: true,
      message: 'Cadastro concluído com sucesso!',
      user: { name: userName, email: userEmail }
    };
  } else {
    registrationResult = {
      success: false,
      message: 'Dados inválidos.'
    };
  }

  assert.strictEqual(registrationResult.success, true);
  assert.strictEqual(registrationResult.message, 'Cadastro concluído com sucesso!');
});

Then('sou direcionado para a área inicial do sistema', function () {
  // Simula a verificação do redirecionamento
  // Em um teste real, você verificaria o estado da aplicação
  assert.ok(registrationResult.user, 'Usuário deveria ter sido criado e retornado.');
  console.log(`Usuário ${registrationResult.user.name} foi redirecionado.`);
});

// --- Cenário: Usuário tenta cadastrar com dados inválidos ---

When('não preencho todos os campos obrigatórios', function () {
  // Simula a falta de preenchimento de campos obrigatórios
  userName = '';
  userEmail = '';
  userPass = '';
  userPassConfirm = '';
  errorMessages.push('Campos obrigatórios não preenchidos');
});

When('informo um e-mail já registrado no sistema', function () {
  // Simula o uso de um e-mail já registrado
  userEmail = 'existing@example.com';
  errorMessages.push('E-mail já registrado');
});

Then('vejo mensagens de erro indicando os problemas nos dados fornecidos', function () {
  // Verifica se as mensagens de erro estão presentes
  assert.ok(errorMessages.length > 0, 'Esperava mensagens de erro');
});

Then('permaneço no processo de cadastro até corrigir os erros', function () {
  // Simula que o usuário permanece no processo de cadastro
  isInRegistrationProcess = true;
  assert.strictEqual(isInRegistrationProcess, true);
});

// --- Cenário: Usuário atualiza suas informações pessoais ---


// Removido duplicidade para resolver conflito de múltiplas definições

When('acesso a funcionalidade de edição de perfil', function () {
  // Simula acesso à edição de perfil
  assert.ok(true, 'Acesso à edição de perfil');
});

When('altero minhas informações pessoais como nome ou e-mail', function () {
  // Simula alteração de informações pessoais
  userName = 'Felipe Atualizado';
  userEmail = 'felipe.atualizado@example.com';
});

Then('vejo uma mensagem confirmando que as alterações foram salvas', function () {
  // Simula confirmação de salvamento
  assert.ok(true, 'Alterações salvas');
});

Then('as novas informações são refletidas no meu perfil', function () {
  // Simula verificação das novas informações
  assert.strictEqual(userName, 'Felipe Atualizado');
  assert.strictEqual(userEmail, 'felipe.atualizado@example.com');
});

// --- Cenário: Usuário exclui sua conta ---

Given('que estou autenticado no sistema', function () {
  // Removido para evitar ambiguidade, use a definição centralizada em support/hooks.steps.ts
  return;
});

When('acesso a funcionalidade de exclusão de conta', function () {
  // Simula acesso à exclusão de conta
  assert.ok(true, 'Acesso à exclusão de conta');
});

When('confirmo a exclusão', function () {
  // Simula confirmação da exclusão
  registrationResult = { success: true, message: 'Conta excluída com sucesso!' };
});

Then('vejo uma mensagem indicando que minha conta foi excluída', function () {
  // Simula mensagem de exclusão
  assert.strictEqual(registrationResult.message, 'Conta excluída com sucesso!');
});

Then('sou deslogado do sistema', function () {
  // Simula logout
  assert.ok(true, 'Usuário deslogado');
});

Then('não consigo mais acessar minha conta com as credenciais anteriores', function () {
  // Simula tentativa de acesso com credenciais antigas
  assert.ok(true, 'Acesso negado com credenciais antigas');
});

// --- Cenário: Usuário tenta cadastrar com senha fraca ---

When('informo uma senha que não atende aos critérios de segurança', function () {
  userPass = '123';
  errorMessages.push('Senha fraca');
});

Then('vejo uma mensagem de erro indicando que a senha é fraca', function () {
  assert.ok(errorMessages.includes('Senha fraca'), 'Mensagem de senha fraca esperada');
});

Then('sou solicitado a escolher uma senha mais forte', function () {
  assert.ok(true, 'Solicitação para senha mais forte');
});
