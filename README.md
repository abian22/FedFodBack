# FedFod Project

Welcome to the FedFod project repository!

This project is a web application designed as a simplified clone of the popular social media platform TikTok. It was created as part of a personal project to practice and learn different technologies and concepts, including MongoDB for the database, handling authentication through Google, file upload, implementing a real-time chat, managing notifications, and integrating an online donation system.

## Objective

The main objective of this project is to explore and understand how various key features of a modern web application work. This includes user management, real-time interaction between users through a chat, sending and receiving notifications, as well as implementing an online donation system.

## Technologies Used

- MongoDB for the database.
- Node.js and Express.js for the backend.
- React.js for the frontend.
- User authentication via Google.
- Online payment services for donation functionality.
- 
## Installation and Server Execution

To run the backend, you'll need to use npm install to install the packages and then start it with the command node index.js.

## Hosting

This project is hosted on Render, and the frontend can be accessed via the following URL https://github.com/abian22/FedFodFront: 

## Key Features

1. **User Authentication**: Allows users to register and log in to the application using their Google accounts.
2. **File Upload**: Enables users to upload and share videos on the platform.
3. **Real-Time Chat**: Facilitates real-time communication between users through an integrated chat.
4. **Notification Management**: Sends notifications to users to inform them about important events within the application.
5. **Donation System**: Allows users to make online donations to support the development and maintenance of the application.

## ENDPOINTS

### Auth Endpoints

| METHOD | ENDPOINT     | TOKEN | ROLE | DESCRIPTION           |
| ------ | ------------ | ----- | ---- | --------------------- |
| POST   | /auth/signup | -     | -    | User Sign Up          |
| POST   | /auth/login  | -     | -    | User Log In           |

### User Endpoints

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| GET    | /user                                       | YES   | User  | Get all users                                        | 
| GET    | /user/me                                    | YES   | User  | Get user´s profile access                            |            
| GET    | /user/:identifier                           | YES   | User  | Get one user                                         |
| POST   | /user                                       | YES   | Admin | Add one user                                         |
| POST   | /user/signUp                                | YES   | User  | User registration                                    |
| POST   | /user/login                                 | YES   | User  | User login                                           |
| POST   | /user/search                                | YES   | user  | Search a user                                        | 
| PUT    | /user/me                                    | YES   | User  | Update personal profile by user                      |
| PUT    | /user/:id                                   | YES   | Admin | Update one selected user                             |
| DELETE | /user/me                                    | YES   | User  | Delete personal profile by user                      |
| DELETE | /user/all                                   | YES   | Admin | Delete all users                                     |
| DELETE | /user/:id                                   | YES   | Admin | Delete a user                                        |

### Media Endpoints

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| GET    | /media                                       | YES   | User  | Get all media                                       |
| GET    | /media/me                                    | YES   | User  | Get user´s media                                    |
| GET    | /media/:mediaId                              | YES   | User  | Get one media                                       |
| GET    | /media/user/:userId                          | YES   | User  | Get all medias from a user                          |
| POST   | /media/profileImg                            | YES   | User  | Allows modifying the profile picture                |
| POST   | /media/search                                | YES   | user  | Search a user                                       |
| POST   | /media/:mediaId/like                         | YES   | User  | Add or remove a like from a media                   |
| POST   | /media/:userId                               | YES   | Admin | Upload a media for a user                           |
| PUT    | /media/me/:mediaId                           | YES   | User  | Modify the description from the user media          |
| PUT    | /media/:mediaId                              | YES   | Admin | Modify the description of a media                   |
| DELETE | /media/all                                   | YES   | Admin | Delete all medias                                   |
| DELETE | /media/me/:mediaId                           | YES   | User  | Delete a media from the user's own                  |
| DELETE | /media/:mediaId                              | YES   | Admin | Delete a media                                      |

### Comment Endpoints

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| GET    | /comment                                    | YES   | User  | Get all comments                                     |
| GET    | /comment/:mediaId                           | YES   | User  | Get all comments from a media                        |
| POST   | /comment/:mediaId                           | YES   | User  | Post a comment in a media                            |
| POST   | /comment/:commentId/like                    | YES   | user  | Add or remove a like from a comment                  |
| PUT    | /comment/myComment/:commentId               | YES   | User  | Modifies a comment from the user's own               |
| PUT    | /comment/:commentId                         | YES   | Admin | Modify a comment                                     |
| DELETE | /comment/:commentId                         | YES   | Admin | Delete a comment                                     |
| DELETE | /comment/:mediaId/:commentId                | YES   | User  | Delete a comment from the user's own                 |

### Notification Endpoints

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| GET    | /notification                               | YES   | User  | Receives notifications from the logged-in user       |
| POST   | /notification                               | YES   | User  | Create a notification                                |
| POST   | /notification/read                          | YES   | User  | Changes the notification from unread to read         |

### Chat Endpoints

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| GET    | /chat/:id                                   | YES   | User  | Receives every message from a chat                   |
| POST   | /chat/sendMessage                           | YES   | User  | Create a message                                     |

### Payment Endpoint

| METHOD | ENDPOINT                                    | TOKEN | ROLE  | DESCRIPTION                                          |
| ------ | ------------------------------------------- | ----- | ----- | ---------------------------------------------------- |
| POST   | /payment                                    | YES   | User  | Enables making donations                             |
