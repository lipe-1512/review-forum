Feature: Forum management

  Scenario: Creating a forum
    Given a user named "var3"
    And he is on the "Forums Listing" page
    And the Film "Sonic 3" exists
    When this user creates a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should've done better this time" And Related Film "Sonic 3"
    Then the Forum must be created successfully

  Scenario: Fail to create a forum without a title
    Given a user with username "johndoee"
    And the Film "Sonic 3" exists
    When the user creates a Forum with no Title
    And Related Film "Sonic 3"
    Then the forum should not be created
    And the user should see an error message "Title is required!"

  Scenario: Fail to create a forum
    Given there is no logged user
    When trying to create a Forum with Title "O que vocês acharam do Sonic 3?", Description "I think went well, but should've done better this time" And Related Film "Sonic 3"
    Then the Forum must not be created
    And should throw an error message saying that the user is required
