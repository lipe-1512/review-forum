Feature: Cadastro e Manutenção de Usuários

  Scenario: Usuário realiza cadastro com sucesso
    Given que estou no processo de criação de uma nova conta
    When informo meus dados pessoais válidos, incluindo nome, e-mail e senha
    And confirmo a senha informada
    Then vejo uma mensagem indicando que o cadastro foi concluído com sucesso
    And sou direcionado para a área inicial do sistema

  Scenario: Usuário tenta cadastrar com dados inválidos
    Given que estou no processo de criação de uma nova conta
    When não preencho todos os campos obrigatórios
    Or informo um e-mail já registrado no sistema
    Then vejo mensagens de erro indicando os problemas nos dados fornecidos
    And permaneço no processo de cadastro até corrigir os erros

  Scenario: Usuário atualiza suas informações pessoais
    Given que estou autenticado no sistema
    When acesso a funcionalidade de edição de perfil
    And altero minhas informações pessoais, como nome ou e-mail
    Then vejo uma mensagem confirmando que as alterações foram salvas
    And as novas informações são refletidas no meu perfil

  Scenario: Usuário exclui sua conta
    Given que estou autenticado no sistema
    When acesso a funcionalidade de exclusão de conta
    And confirmo a exclusão
    Then vejo uma mensagem indicando que minha conta foi excluída
    And sou deslogado do sistema
    And não consigo mais acessar minha conta com as credenciais anteriores

  Scenario: Usuário tenta cadastrar com senha fraca
    Given que estou no processo de criação de uma nova conta
    When informo uma senha que não atende aos critérios de segurança
    Then vejo uma mensagem de erro indicando que a senha é fraca
    And sou solicitado a escolher uma senha mais forte
    And não consigo prosseguir com o cadastro até corrigir a senha
