# _evento_
An event management web app using Nestjs &amp; Reactjs

## Technologies Used
- Nestjs
- Reactjs
- Tailwind CSS
- TypeScript
- HeroIcons


## How to install

First, clone the repositories :

```md
    git clone https://github.com/Ismail-Lafhiel/auth-api-nest.git
    git clone https://github.com/Ismail-Lafhiel/_evento_.git
```
Get to the repositories folders :

```md
    cd auth-api-nest
    cd _evento_
```
Open folders in Visual Studio Code :

```md
    code .
```

Install the packages and run the server (backend)

For auth api nest:

```md
    npm i
    npm run start:dev
```

For evento:

```md
    cd evento
    npm i
    npm run start:dev
```

Install the packages and run the server (backend)

```md
    cd evento-front
    npm i
    npm run dev
```

## If you have Docker

Ensure you have it installed:
- [Docker](https://www.docker.com/products/docker-desktop)
  

This project consists of three main services:
- **Frontend**: Runs on port `8080`.
- **Backend**: Runs on port `3001`.
- **Auth Service**: Runs on port `3000`.
  

All services are containerized using Docker and hosted on Docker Hub.

### Firsly, pull the images from dockerhub

```md
    docker pull ismaillf/nest-auth-api
    docker pull ismaillf/evento-backend
    docker pull ismaillf/evento-frontend
```

### Second, run teh containers

```md
    docker run -d -p 3000:3000 --name nest-auth-api ismaillf/nest-auth-api
    docker run -d -p 3001:3001 --name evento-backend ismaillf/evento-backend
    docker run -d -p 8080:8080 --name evento-frontend ismaillf/evento-frontend
```

### Verifying Services
To ensure the containers are running, use:

```md
docker ps
```

You should see the following containers listed:

 - nest-auth-api on 3000:3000
 - evento-backend on 3001:3001
 - evento-frontend on 8080:8080

### Accessing the Services
 - Frontend: http://localhost:8080
 - Backend: http://localhost:3001
 - Auth Service: http://localhost:3000

## The API documentation:
- [Click here](https://documenter.getpostman.com/view/33205971/2sAYBYfVXV)
