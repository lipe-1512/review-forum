Feature: Amigos/Seguidores

  Scenario: Usuário segue outro usuário
    Given que estou navegando pelo perfil de outro usuário
    When seleciono a opção para seguir esse usuário
    Then vejo uma mensagem confirmando que estou seguindo o usuário
    And o usuário aparece na minha lista de seguidos

  Scenario: Usuário deixa de seguir outro usuário
    Given que estou seguindo outro usuário
    When acesso a lista de usuários que sigo
    And seleciono a opção para deixar de seguir um usuário específico
    Then vejo uma mensagem confirmando que deixei de seguir o usuário
    And o usuário não aparece mais na minha lista de seguidos

  Scenario: Usuário visualiza quem está seguindo e quem o segue
    Given que estou autenticado no sistema
    When acesso a funcionalidade de gerenciamento de conexões
    Then vejo duas listas:
      - Uma com os usuários que estou seguindo
      - Outra com os usuários que me seguem
