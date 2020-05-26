# ![RealWorld Example App](logo.png)

> ### Deno/oak codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Deno/oak** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Deno/oak** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

```
├── config.ts
├── .env
├── .env.example
├── src
    ├── main.ts                // this is the starting point of the application
    ├── main.router.ts         // defines routed
    ├── auth                   // handle authentication and authorization
    │   ├── interface          // contains dto and interface
    │   │   └── auth.interfacet.ts
    │   ├── controller         // handle request & response
    │   │   └── auth.controller.ts
    │   ├── service            // business logic
    │   │   └── auth.service.ts
    │   └── repository         // CRUD operations
    │       └── auth.repository.ts
    ├── profile                   // handle user related workload
    │   ├── interface          // contains dto and interface
    │   │   └── profile.interfacet.ts
    │   ├── controller         // handle request & response
    │   │   └── profile.controller.ts
    │   ├── service            // business logic
    │   │   └── profile.service.ts
    │   └── repository         // CRUD operations
    │       └── profile.repository.ts
```

# Getting started

> npm install, npm start, etc.

