Feature: Seguir outros usuários

  Scenario: Usuário começa a seguir outro usuário
    Given o usuário "alice" com ID 1 existe
    And o usuário "bob" com ID 2 existe
    When "alice" decide seguir "bob"
    Then "alice" deve estar seguindo "bob"

  Scenario: Usuário deixa de seguir outro usuário
    Given o usuário "alice" com ID 1 está seguindo o usuário "bob" com ID 2
    When "alice" decide deixar de seguir "bob"
    Then "alice" não deve mais estar seguindo "bob"

  Scenario: Usuário não pode seguir a si mesmo
    Given o usuário "alice" com ID 1 existe
    When "alice" tenta seguir a si mesma
    Then a operação deve falhar com a mensagem "Você não pode seguir a si mesmo."

  Scenario: Usuário tenta seguir alguém que já segue
    Given o usuário "alice" com ID 1 está seguindo o usuário "bob" com ID 2
    When "alice" tenta seguir "bob" novamente
    Then a operação deve falhar com a mensagem "Você já está seguindo este usuário."