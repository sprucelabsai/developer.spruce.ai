# Spruce Standards

<!-- panels:start -->
<!-- div:title-panel -->
## Language and linting

<!-- div:left-panel -->
Everything we build is in Typescript ^3.8. Everything is strongy typed and any lint error will block a build. All the lint rules are defined already, you just need to run `lint`.
<!-- div:right-panel -->
```bash
yarn lint
npm run lint
```
<!-- panels:end -->

<!-- panels:start -->
<!-- div:title-panel -->
## Class syntax

<!-- div:left-panel -->
1. Classes are always CapitalCase
2. Use function literals server side and arrow functions on client side when defining methods
   1. There are speed considerations when loading lots of code
3.  Always export the class as default from the file by its name


<!-- div:right-panel -->
### Server side class definition example
```js
// Log.ts

// not the class, so exported by name
export interface IVehicle {
    start(): void
}

// export the class as default
export default class Car implements IVehicle {
    // define the function literal like it's 1995, no arrow
    start() {
        console.log('starting')
    }
}
```


### Client side class definition example
```js
// Log.ts

// exported by name
export interface IVehicle {
    start(): void
}

// export the class as default (same as server side)
export default class Car extends Vehicle {
    // define as arrow function so scope is bound
    start = () => {
        console.log('starting')
    }
}
```

<!-- panels:end -->
## Singletons

We use singletons for various things like logging and Mercury.

1. Internally
   1. `Class -> import Log from ‘.../Log’`
   2. `Singleton -> import { log } from ‘../Log’`
2. Externally
   1. `Class -> import { Log } from ‘@sprucelabs/log’`
   2. `Singleton -> import log from ‘@sprucelabs/log’`

## Initializing Classes

1. If a class cannot be instantiated before some setup is done, we call it “initializing”
2. The method doing the initialization is called `initialize()`
3. The method must be static

## Watchers

1. `y watch` / `y build lint` throw errors
2. `Y watch` / `y build --silent` does not throw errors


## Factories + Fetchers

1. Create a method by the name of the object being created or fetched
   1. `const formBuilder = this.formBuilder(definition, values)`
   2. `const user = this.store.user.user(values)`
2. Variations on factories and fetchers start with object name followed by ‘by’ or ‘with’ or ‘from’ and a description
3. `const user = this.store.user.userWithToken(valuesWithToken)`
   1. A token field is normally not on a user object, so withToken calls out it will be the user with auth information
   2. `const user = await this.store.user.userFromToken(token)`
4. This tells us we are getting the user based on their token.
5. A fetcher is usually async, use lint to know when to await
6. For more than 1, name becomes plural
   1. `const users = this.store.user.users(...)`
   2. `const users = this.store.user.usersById()`

## Generators

1. Code that writes to “generated” files
2. Templates must be hbs
3. Generators live in CLI  as the source of the template (.hbs)
4. Example, SchemaGenerator is in @sprucelabs/schemas
5. Generators in a folder called @spruceslabs/spruce-cli /generators
6. Class name ends in Generator
7. Each method starts with generator
8. Generators must return a string (not write a file)
9. Handling handlbar helpers
   1.  helpers are "addons"
10. TODO: define event contracts for mercury for pulling types

## **Addons**

An addon is a script that performs some configuration or extension of an existing system.

* Goes in `/addons`
  * `./addons/handlebars`
  * Does NOT export anything
