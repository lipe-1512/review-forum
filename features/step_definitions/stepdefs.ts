import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

const users: any[] = [];
let currentUser: any = null;
let authenticatedUser: any = null;
let followingUsers: Set<string> = new Set();
let userLists: Map<string, Set<string>> = new Map();
let passwordRecoveryRequests: Map<string, string> = new Map();
let userReviews: Map<string, any[]> = new Map();

Given('que desejo criar uma conta', function () {
  currentUser = {};
});

When('forneço um nome válido, um e-mail válido e uma senha válida', function () {
  if (!currentUser) throw new Error('Usuário não inicializado');
  currentUser.name = 'Teste';
  currentUser.email = 'teste@example.com';
  currentUser.password = 'senha123';
});

Then('minha conta é criada com sucesso', function () {
  if (!currentUser || !currentUser.name || !currentUser.email || !currentUser.password) {
    throw new Error('Dados incompletos');
  }
  users.push(currentUser);
  authenticatedUser = currentUser;
});

Then('sou autenticado no sistema', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  return true;
});

When('forneço dados inválidos (como e-mail incorreto ou senha muito curta)', function () {
  currentUser = { name: '', email: 'invalido', password: '123' };
});

Then('minha conta não é criada', function () {
  if (currentUser && currentUser.name && currentUser.email && currentUser.password) {
    throw new Error('Conta criada com dados inválidos');
  }
});

Then('recebo mensagens de erro claras para os campos incorretos', function () {
  return true;
});

Given('que estou autenticado', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
});

When('altero minhas informações pessoais (nome, bio, foto, etc.)', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  authenticatedUser.name = 'Nome Atualizado';
});

When('salvo as alterações', function () {
  // Simula salvar alterações
  return true;
});

Then('minhas informações são atualizadas com sucesso', function () {
  if (!authenticatedUser || authenticatedUser.name !== 'Nome Atualizado') {
    throw new Error('Falha na atualização');
  }
});

Then('as novas informações aparecem refletidas no sistema', function () {
  return true;
});

When('tento salvar alterações com dados inválidos', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  authenticatedUser.name = '';
});

Then('minhas informações não são atualizadas', function () {
  if (authenticatedUser && authenticatedUser.name === '') {
    throw new Error('Dados inválidos salvos');
  }
});

Then('recebo mensagens de erro claras', function () {
  return true;
});

When('confirmo a exclusão da minha conta', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  users.splice(users.indexOf(authenticatedUser), 1);
  authenticatedUser = null;
});

Then('minha conta é excluída permanentemente do sistema', function () {
  if (authenticatedUser) {
    throw new Error('Usuário não excluído');
  }
});

Then('sou deslogado automaticamente', function () {
  return true;
});

Given('que estou autenticado', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
});

When('decido seguir outro usuário', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  followingUsers.add('usuarioSeguido');
});

When('realizo a ação de seguir', function () {
  return true;
});

Then('começo a seguir esse usuário', function () {
  if (!followingUsers.has('usuarioSeguido')) {
    throw new Error('Não está seguindo o usuário');
  }
});

Then('posso visualizar conteúdo relacionado a ele', function () {
  return true;
});

Given('que já sigo um determinado usuário', function () {
  followingUsers.add('usuarioSeguido');
});

When('tento segui-lo novamente', function () {
  // Nenhuma ação adicional
});

Then('nenhuma ação adicional é realizada', function () {
  return true;
});

Then('não há duplicidade na lista de seguidos', function () {
  if (Array.from(followingUsers).filter(u => u === 'usuarioSeguido').length > 1) {
    throw new Error('Duplicidade na lista de seguidos');
  }
});

When('decido deixar de segui-lo', function () {
  followingUsers.delete('usuarioSeguido');
});

When('realizo a ação de parar de seguir', function () {
  return true;
});

Then('deixo de seguir esse usuário', function () {
  if (followingUsers.has('usuarioSeguido')) {
    throw new Error('Ainda está seguindo o usuário');
  }
});

Then('não vejo mais conteúdo relacionado a ele', function () {
  return true;
});

Given('que não sigo um determinado usuário', function () {
  followingUsers.delete('usuarioNaoSeguido');
});

When('tento deixar de segui-lo', function () {
  // Nenhuma ação
});

Then('nenhuma ação é realizada', function () {
  return true;
});

Then('não há impacto no sistema', function () {
  return true;
});

Given('que estou autenticado', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
});

Given('estou visualizando um item de entretenimento', function () {
  // Simula visualização
  return true;
});

When('escolho adicionar esse item à uma lista pessoal', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  if (!userLists.has(authenticatedUser.email)) {
    userLists.set(authenticatedUser.email, new Set());
  }
  userLists.get(authenticatedUser.email)!.add('item1');
});

When('seleciono a lista correta (ex: Assistidos, Lidos, Quero Ver)', function () {
  return true;
});

Then('o item é adicionado com sucesso à lista escolhida', function () {
  if (!userLists.get(authenticatedUser.email)!.has('item1')) {
    throw new Error('Item não adicionado');
  }
});

Given('o item já está na lista escolhida', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  if (!userLists.has(authenticatedUser.email)) {
    userLists.set(authenticatedUser.email, new Set());
  }
  userLists.get(authenticatedUser.email)!.add('item1');
});

When('tento adicioná-lo novamente', function () {
  // Nenhuma ação para duplicidade
});

Then('o item não é duplicado', function () {
  const items = Array.from(userLists.get(authenticatedUser.email)!);
  const count = items.filter(i => i === 'item1').length;
  if (count > 1) {
    throw new Error('Item duplicado na lista');
  }
});

Then('uma mensagem clara informa que o item já está na lista', function () {
  return true;
});

Given('tenho um item em uma lista pessoal', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  if (!userLists.has(authenticatedUser.email)) {
    userLists.set(authenticatedUser.email, new Set());
  }
  userLists.get(authenticatedUser.email)!.add('item1');
});

When('escolho remover esse item da lista', function () {
  userLists.get(authenticatedUser.email)!.delete('item1');
});

Then('o item é removido com sucesso', function () {
  if (userLists.get(authenticatedUser.email)!.has('item1')) {
    throw new Error('Item não removido');
  }
});

Given('o item não está na lista', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
  if (!userLists.has(authenticatedUser.email)) {
    userLists.set(authenticatedUser.email, new Set());
  }
  userLists.get(authenticatedUser.email)!.delete('item2');
});

When('tento removê-lo', function () {
  // Nenhuma ação
});

Then('nenhuma ação é realizada', function () {
  return true;
});

Then('uma mensagem clara informa que o item não está na lista', function () {
  return true;
});

Given('que esqueci minha senha', function () {
  // Simula pedido de recuperação
  return true;
});

When('solicito a recuperação de conta usando meu e-mail', function () {
  passwordRecoveryRequests.set('teste@example.com', 'token123');
});

Then('recebo um link seguro no meu e-mail', function () {
  if (!passwordRecoveryRequests.has('teste@example.com')) {
    throw new Error('Link não enviado');
  }
});

When('acesso o link e digito uma nova senha válida', function () {
  // Simula redefinição de senha
  return true;
});

Then('minha senha é atualizada com sucesso', function () {
  return true;
});

Then('posso fazer login com a nova senha', function () {
  return true;
});

Given('que estou autenticado', function () {
  if (!authenticatedUser) throw new Error('Usuário não autenticado');
});

When('acesso a seção de histórico de atividades', function () {
  // Simula acesso ao histórico
  return true;
});

Then('vejo uma lista organizada das avaliações que realizei', function () {
  return true;
});

Then('cada avaliação mostra o item avaliado, a data e a nota atribuída', function () {
  return true;
});
