# EXPENSO

## Modules

### User Module

### Connection Module
- [X] ADD FRIEND
  - [X] Make Email field optional
  - [X] Make Phone field optional
  - [X] When there exist a user with same name or email or phone just retake input of the field that exist and not all the fields
  - [X] Change the email and phone if empty instead of undefined make the field null or empty string
  - [X] Create a friend form that asks user for friends details and use it to add friend

- [ ] SEARCH FRIEND
  - [X] Create a custom table rather tha using console.table
  - [ ] Limit the display of the table to 5 users
  - [ ] Display the total number of users and the total number of pages available
  - [ ] Should be able to move between the pages using arrow keys

- [ ] UPDATE FRIEND
  - [X] Remove the currently using switch case to ask for the fields
  - [X] Use the search to get the matched query value, display it and ask user what to update (Basically ask user to prompt a number corresponding to the value it wants to update)
  - [X] The updating friend must be in such a way that it should ask name, email, phone and balance if not supplied a particular value keep the existing value as default
  - [X] Use the friend form to update friend
  
- [ ] DELETE FRIEND
  - [X] Use the search to get the match values and then display the table and ask the user what to delete (Basically ask user to prompt a number corresponding to the value it wants to update)
  - [X] Ask for a confirmation before deleting directly
  - [ ] Implement soft delete

- [X] ERROR
  - [X] Error handling in the repository to convey the message to the presentation layer
  - [X] Database errors (In our case its files)
    - [X] Create a Conflict error class that extends the Error class (Basically create a custom error class)
    - [X] Then handle the errors in the repository and pass the info to the presentation layer to convey the user

- [X] FILE STORAGE
  - [X] Read and write to the file optimization using persistant storage system using file storage and db abstraction layers