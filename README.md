# The Gulag

A small user restricted forum 

## Getting Started

These instructions will give you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on deploying the project on a live system.

### Prerequisites

Requirements for the software and other tools to build, test and push 
- [Node Version Manager](https://creativecommons.org/)
- [A MongoDB database](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

### Installing

A step by step series of examples that tell you how to get a development
environment running

Step 1: clone the repository to the local enviroment via a CLI or by downloading and extracting the zip folder

    git clone https://github.com/TalonTX4/The-Gulag.git

change node package manager to version 19.1.0

    nvm use 19.1.0

run node package manager install (`npm i`) in the root and client directories

Create a .env file formatted as seen below or as seen in `./templates/.env.template`

    MONGOURI="Database uri"
    JWTSECRET="random string"

finally start both the client and server with `npm run dev` in the root directory

## Running the tests

Run `npm test` in the root directory

## Built With

  - [WebStorm](https://www.jetbrains.com/webstorm/) - Used
    as the primary IDE for the durration of the project

## Authors

  - **Joseph Paier** - *Constructed the website front to back* -
    [PurpleBooth](https://github.com/PurpleBooth)

See also the list of
[contributors](https://github.com/PurpleBooth/a-good-readme-template/contributors)
who participated in this project.

## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Stack Overflow for all the helr with every unexpected error
