# Hello there 👋🏽 - lemme give you a short tour of this repo

I'm **super excited** to have you. Let's dive right in.

First off, here are helpful links

POSTMAN DOCUMENTATION - https://www.postman.com/crimson-flare-787076/emediong-de-don/collection/3qek5m7/skyventures-tasks

RENDER DEPLOYMENT && SWAGGER DOCS - https://emediong-skyventures-task-api.onrender.com

### DOCKER 🐳

![Docker Desktop](https://res.cloudinary.com/emediong5135/image/upload/v1730427980/testing/docker_1.png)

Build docker image and run docker container

![Docker VSCODE](https://res.cloudinary.com/emediong5135/image/upload/v1730427980/testing/docker_2.png)

### INTEGRATION TEST 🧪

User integration tests `npm run test:user`

![User test](https://res.cloudinary.com/emediong5135/image/upload/v1730427980/testing/user_test.png)

Project integration tests `npm run test:project`

![Project test](https://res.cloudinary.com/emediong5135/image/upload/v1730427980/testing/project_test.png)

Task integration tests `npm run test:task`

![Task test](https://res.cloudinary.com/emediong5135/image/upload/v1730427980/testing/task_test.png)

### ENVIRONMENTS

Assuming local installation of MongoDB, Mongo Atlas works too, my friend 😁

```
PORT=8000
DATABASE_URL=mongodb://localhost:27017/skyventures-task-api
TEST_DATABASE_URL=mongodb://localhost:27017/test_db
JWT_SECRET=<randomly_generated_secret_key>
```

To randomly generate a secret key if you got Python installed

```
Type python from your cmd and then

>>> import secrets

>>> secrets.token_urlsafe()
```
