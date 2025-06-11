Feature: Recuperação de Conta via E-mail

  Scenario: Usuário recupera sua senha
    Given que esqueci minha senha de acesso ao sistema
    When solicito a recuperação de senha usando meu e-mail cadastrado
    Then recebo um e-mail com instruções para redefinir minha senha
    When acesso o link fornecido no e-mail e defino uma nova senha
    Then vejo uma mensagem confirmando que minha senha foi atualizada
    And consigo acessar o sistema com a nova senha

  Scenario: Usuário tenta recuperar senha com e-mail não cadastrado
    Given que esqueci minha senha de acesso ao sistema
    When solicito a recuperação de senha usando um e-mail não cadastrado
    Then vejo uma mensagem informando que o e-mail não está associado a nenhuma conta
    And sou orientado a verificar o e-mail informado ou criar uma nova conta
