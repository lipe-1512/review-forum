Feature: Forum Management

Scenario: creating a forum
  Given i'm logged as user with username "var3"
  And he is on the "Forums Listing" page
  And the Movie "Sonic 3" exists with ID "3"
  When this user creates a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should've done better this time" And Related Movie "3"
  Then the Forum must be create successfully

Scenario: Fail to create a forum without a title
  Given i'm logged as user with username "johndoe"
  And the Movie "Sonic 3" exists
  When the user create a Forum with no Title, Related Movie "3"
  Then the forum should not be created
  And shold raise a error saying that "O título do forum é obrigatório"

Scenario: Fail to create a forum without username
  Given i'm logged as user with username "johndoe"
  And the Movie with title "Sonic 3" is saved with id "3"
  When try to create a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should've done better this time", Related Movie "3" And username ""
  Then the Forum must not be created
  And shold raise a error saying that "O usuário é um campo obrigatório"

Scenario: Fail to create a Forum with non existing movie
  Given i'm logged as user with username "johndoe"
  And the Movie with ID 3 does not exist
  When this user tries to create e Forum with Title "Lorem ipsum lorem ipsum", Description "What ever" and Related Movie "3"
  Then the Forum must no be created
  And shold raise a error saying that "O usuário é um campo obrigatório"


Scenario: Fail to create a Forum without movie
  Given i'm logged as user with username "johndoe"
  When this user tries to create e Forum with Title "Lorem ipsum lorem ipsum", Description "What ever"
  Then the Forum must no be created
  And shold raise a error saying that "O usuário é um campo obrigatório"