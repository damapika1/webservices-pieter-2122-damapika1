# PINS API

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Start](#start)
6. [Commands](#commands)
7. [Common errors](#errors)
8. [Documentation](#documentation)
# general-info
This is an API for an application where the users can pin images or notes on a dashboard
# technologies
It is recommended to install Yarn through the npm package manager, which comes bundled with Node.js when you install it on your system.
Once you have npm installed you can run the following both to install and upgrade Yarn:
```
npm install --global yarn
```
# installation
Before running the app:
```
yarn install
```
# configuration
To start this API, create a .env file in the root of this folder with this content

NODE_ENV="development"
DATABASE_USERNAME="your_database_username"
DATABASE_PASSWORD="your_database_password"
Update the username and password with the credentials of your local database.

You can also extend the .env file with these configurations, only if the database host/port are different than our default.

DATABASE_HOST="localhost"
DATABASE_PORT=3306
# start
Run the app with:
```
yarn start
```

# commands
- Run tests with
```
yarn test
```
- Check tests coverage with
```
yarn test:coverage
```
- Run seeds with
```
yarn start seed
```
# errors
Modules not found errors, try this and run again:
```
yarn install
```
Migrations failed, try dropping the existing pins database and run again
# documentation
- JSDoc: An API documentation generator for JavaScript.

To install the latest version on npm locally and save it in your package's package.json file:
```
npm install --save-dev jsdoc
```
If you installed JSDoc locally, the JSDoc command-line tool is available in ./node_modules/.bin.
To generate documentation for the file yourJavaScriptFile.js:
```
./node_modules/.bin/jsdoc yourJavaScriptFile.js
```
# login
- You can login by using:

e-mail:
```
rayme.emin@student.hogent.be
```
password:
```
12345678
```

