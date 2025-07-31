Feature: Comment features BDD coverage

Scenario: creating a comment
    Given i am logged as user with username "johndoe"
    And i am at the Forum Page with ID "3"
    When i create a new comment with the content "Cool film, liked"
    Then a new comment must be created with "Cool film, liked" as content and username "johndoe"

Scenario: creating a comment without a username
    Given i am not logged in
    And i am at Forum Page with ID "1"
    When i try to create a new comment with the content "Bad movie, should be better"
    Then the comment is not created
    And shold raise a error saying that "O usuário é um campo obrigatório"

Scenario: creating a comment without content
    Given i am logged as user with username "johndoe"
    And i am at Forum Page with ID "1"
    When i try to create a new comment without the content
    Then the comment is not created
    And shold raise a error saying that "O conteúdo é um campo obrigatório"


Scenario: creating a comment with a invalid forum
    Given i am logged as user with username "johndoe"
    And i am at invalid Forum Page with ID "329"
    When i try to create a new comment with the content "Lorem Ipsum"
    Then the comment is not created
    And shold raise a error saying that "Fórum inválido"

 