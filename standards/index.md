# Spruce Standards

<!-- panels:start -->
<!-- div:title-panel -->
## Language and linting

<!-- div:left-panel -->
Everything we build is in Typescript ^3.8. Everything is strongly typed and any lint error will block a build. All the lint rules are defined already, you just need to run `lint`.
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
<!-- tabs:start -->

#### ** Server side class definition **
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


#### ** Client side class definition **
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

<!-- tabs:end -->

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

## Generating templates

![Generating templates](../_images/template-generation.jpeg?raw=true "Generating templates")

## **Addons**

An addon is a script that performs some configuration or extension of an existing system.

* Goes in `/addons`
  * `./addons/handlebars`
  * Does NOT export anything

<!-- panels:start -->
<!-- div:title-panel -->
## **Commenting your code**
<!-- div:left-panel -->
* All comments are sentence case. This means they start with a Capital letter (period optional).
* When commenting on a resolving (enum) field, add an extra star and Sentence case.
<!-- div:right-panel -->
<!-- tabs:start -->
#### ** Class comments **
```js 
/** This class comment is correct! */
export default MyClass {
   /** This method do something very important! */
   public myImportantMethod() {...}
}
```
#### ** Typed comments **
Notice comment is above `code` since that is the field used for disambiguation. Also the enum is in the comment to help with hints.
```js
export interface ISpruceErrorUnknownError
	extends ISpruceErrorOptions<SpruceErrorCode> {
   /** * SpruceErrorCode.UnknownError: We aren't sure what happened */
	code: SpruceErrorCode.UnknownError
}

export interface ISpruceErrorMissingParameters
	extends ISpruceErrorOptions<SpruceErrorCode> {
   /** * SpruceErrorCode.MissingParameters: Something is missing */
	code: SpruceErrorCode.MissingParameters
	parameters: string[]
}

export interface ISpruceErrorInvalidParameters
	extends ISpruceErrorOptions<SpruceErrorCode> {
   /** * SpruceErrorCode.InvalidParameters: Some parameter is bad */
	code: SpruceErrorCode.InvalidParameters
	parameters: string[]
}


```

<!-- tabs:end -->
<!-- panels:end -->


## File+directory naming
1. Class file names match class name
2. Plural directory names (More to define)

## Test
Test files should match the name of the file (*.test.ts) and be next to the file it is testing:

1. `src/SpruceError.ts` -> `src/SpruceError.test.ts`
2. `/lib/helpers.ts` -> `/lib/helpers.test.ts`


## Abstract classes

1. Start with `Abstract`
2. ALWAYS EXTEND (never implement)
3. If the abstract class doesn't need to do anything, use an interface.

## Base classes

1. Meant to be extended
2. Start with `Base`

## Documentation rules

1. developer.spruce is focused on the tools and how to use them
2. Education (curriculum) is done through `spruce onboard`


## Cli interface standards

1. spruce {{feature}}:{{verb}}
2. bracket [] optional args
3. Chevron <> required args
4. All args on top level are optional
5. If required args are not supplied, use `formBuilder` to acquire them
