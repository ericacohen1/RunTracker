# RunTracker

## Overview:
RunTracker is an application targeted to active users who want to track their running activities. Users will enter their run activity date, distance, and time for each run. The profile page will show the users' historic run activities including their calculated average pace.

## Usage
- New Users
    - Create a [new account](https://runtracker-app.herokuapp.com/signup) to get started
    - You will be redirected to your profile page and can start entering run data
    - All run data previously entered will be displayed in a table below
- Existing Users
    - [Login](https://runtracker-app.herokuapp.com/) to the site and you will be redirected to your profile page
    - From the profile pages users will be able to **C**reate **R**ead **U**pdate and **D**elete run data.

## Technical Notes:
RunTracker is a RESTful full-stack web application utilizing MVC architecture. The app is structured as:
- Model
    - Uses Sequelize to define the model information and interface with the Heroku hosted MySQL database.
- View
    - Data is presented to the user in the view
    - The views are static HTML pages served up via routes defined in the controller and served up via the server.
- Controller
    - The controller defines the API and HTML routes for the client views and server API routes
    - The user requests and interfaces the app 

## Technology Used
- `bcrypt` to store encyrpted password in database
- Sequelize as a model for interfacing with the database
- Node server running express
- Bootstrap for page styling
- jQuery for displaying data from MySQL in the browser
- Moment.js for formatting date and time data