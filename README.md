[![Stories in Ready](https://badge.waffle.io/glorypod/spkr.png?label=ready&title=Ready)](https://waffle.io/glorypod/spkr)
# SPKR

  > Designed for people who need to speak in front of large groups often, SPKR allows presenters to continuously improve on their public speaking skills.


## Table of Contents

1. [What is SPKR?](#what-is-spkr)
1. [Team](#team)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Viewing the project](#viewing-the-project)
    1. [Running tests](#running-tests)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## What is SPKR?

> SPKR allows presenters to improve on their public speaking abilities by way of crowdsourcing audience feedback. SPKR generates a unique link to a feedback form for a speaker's presentation that they can provide to audience members at the end of a talk. Audience members will be able to access the feedback form and rate the speaker's performance on criteria ranging from audience connection to body language. 
Once logged in, presenters will be able to track their overall rating on a specific criteria for a specific presentation as well as their improvement over multiple presentations. This feedback cycle lets users know what they are good at, what they can improve on, and if any changes in the way they present are accomplishing their goals. More information can be found [here](https://github.com/glorypod/spkr/blob/master/_PRESS-RELEASE.md)

## Team

  - __Product Owner__: gato-gordo
  - __Scrum Master__: sdxl
  - __Development Team Members__: ematsusaka, trsreagan3, vahagnst 
  
## Requirements
- MongoDB
- Express 
- Angular 
- Node 

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Viewing the project

From the command line:
mongod

In a separate terminal tab/window:
nodemon index.js

In the browser:
Navigate to : 
localhost:8000

(To view the database, in another terminal tab/window, type:
mongo)

### Running tests
Following all steps in "Viewing the project" then:

Front-end tests: 
(from the project root directory in a separate tab on the command line)
gulp karma

Back-end tests:
(from the project root directory in a separate tab on the command line)
gulp mocha OR npm test

### Roadmap

View the project roadmap [here](https://github.com/glorypod/spkr/issues)

## Contributing

See [CONTRIBUTING.md](https://github.com/glorypod/spkr/blob/master/_CONTRIBUTING.md) for contribution guidelines.
