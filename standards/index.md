# Spruce Standards

## Class syntax

* Classes are always CapitalCase
* Use function literals server side and arrow functions on client side when defining methods
   * There are speed considerations when loading lots of code
 * Always export the class as default

### Server side class definition example
```ts
// Log.ts



// export the class as default
export default class Car extends Vehicle {
    // define the function literal like it's 1995, no arrow
    start() {
        console.log('starting')    
    }
}
```

### client side class definition example
```ts
// Log.ts
// export the class as default (same as server side)
export default class Car extends Vehicle {
    // define as arrow function so scope is bound 
    start = () => {
        console.log('starting')
    }
}

```

## Singletons

We use singletons for various things like logging and Mercury. 

1. aoeu

## Initializing Classes

## Class syntax

## Watchers

## Factories + Fetchers

## Generators

## **Addons**