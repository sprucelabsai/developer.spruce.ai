

# Schemas
```bash
spruce schema:create
```
<!-- panels:start -->
<!-- div:left-panel -->
Schemas serve 2 purposes:

1. A way to define, validate, and normalize universal data structures and types
2. A universal way to define, validate, and normalize data structures and types


## Define
A location, a schedule, an appointment, or even a button; all these things exist outside of skill and information about them may be shared between skills. By creating and sharing definitions, we all benefit from the awareness each other brings to the platform.

## Validate

A valid email is a valid email and you should never have to write `isValidEmail` code again! By having a standardized way of handling data validation, we ensure if it's been written, you don't have to rewrite it.

## Normalize

Are you familiar with `google-libphonenumber`? No? Good. Here's my promise, you'll never have to write a phone number formatter again! In fact, if you can think of, it probably already has a transformer/formatter.



<!-- div:right-panel -->
<!-- tabs:start -->

#### ** Define **

```js
// schemas/shirt.definition.ts

import Schema, { ISchemaDefinition, FieldType, buildSchemaDefinition } from '@sprucelabs/schema'

// define your thing
const shirtDefinition: ISchemaDefinition = buildSchemaDefinition({
    id: 'shirt',
    name: 'Shirt',
    description: 'Put it on your body!',
    fields: {
        size: {
            type: FieldType.Select,
            label: 'Size',
            options: {
                choices: [
                    {
                        value: 's',
                        label: 'Small'
                    },
                    {
                        value: 'm',
                        label: 'Medium'
                    }
                ]
            }
        }
    }
})

// always export the definition as the default from a .definition.ts file
export default shirtDefinition


```

#### ** Validate **

```js
import log from 
import Schema from '@sprucelabs/schema'
import SpruceSchemas from '#spruce/schemas/schemas.types'

// create a schema from the definition
const shirtSchema: ShirtInstance = new Schema(SpruceSchemas.local.Shirt.definition);

// set a value
shirtSchema.set('size', 's') // works
console.log(shirtSchema.get('size')) // 's'
console.log(shirtSchema.values) // { size: 's' }

// set invalid value
shirtSchema.set('size', 'M') // throws FieldValidationError
console.log(shirtSchema.get('size')) // 's'
console.log(shirtSchema.values) // { size: 's' }

// skip validation
shirtSchema.set('size', 'SUPERBIG', { validate: false }) // works
console.log(shirtSchema.get('size')) // throws FieldValidationError
console.log(shirtSchema.get('size', { validate: false })) // 'SUPERBIG'
console.log(shirtSchema.values) // { size: 'SUPERBIG' }

// validate entire schema
const isValid = shirtSchema.isValid() // false
shirtSchema.validate() // throws FieldValidationError

// a full object matching the schema definition
const values: SpruceSchemas.local.IShirt = schema.getValues() // throws FieldValidationError because size
shirt.setValues({ size: 's' }) // set size to valid value

console.log(schema.getValues()) // { size: 's'}


```
#### ** Normalize **

```js
const { FieldFactory } from '@sprucelabs/schema'

// schemas use fields under-the-hood, but you can use them directly
const phoneNumberField = new FieldFactory.field({
    type: FieldType.Phone
})

// transform to the fields value type (in this case, a nicely formatted string)
const phone = phoneNumberField.toValueType('7203332222')
console.log(phone) // +1 720-253-5250

// even validate directly
phoneNumberField.validate('232324234234234') // throws FieldValidationError

```
<!-- tabs:end -->
<!-- panels:end -->

## Building your first schema




## CLI commands

* `spruce schema:create [name]` - Begin defining a schema with a name
  * `-d, --definitionDestinationDir` - _default ./src/schemas_ - Where the definition will be created (should probably never change this)
  * Results in `./schemas/{{camelName}}.definition.ts`
  * Updates the `#spruce/schemas/schemas.types` to include your definition
* `spruce schema:sync` - Updates `#spruce/schemas/schemas.types` to be in sync with your `.definition.ts`
  * `-d, --destinationDir` - _default #spruce/schemas_ - Where the types will be created (should probably never change this)
  * `-c, --clean` - Should I clean out the `destinationDir` before saving the new types files?
  * `-f, --force` - Suppress confirmation on clean
  * Runs as part of `spruce watch` to ensure all types match your definitions


## Using your definitions

I make it really easy to import a definition from anywhere.

`import { SpruceSchemas } from '#spruce/schemas/schemas.types'`

All your definitions will be attached under `SpruceSchemas.local`.


## Field Types

* `FieldType.Boolean` - A simple true/false
   *  Coerces the string `"false"` to `false`, all other strings become `true`.
*  `FieldType.Date` - Store a date object.
*  `FieldType.DateTime` - Store a date object, but always ignores time (setting it to beginning of day).
*  `FieldType.Duration` - A span of time.
*  `FieldType.File` - A file on a local or remote machine.
*  `FieldType.Id` - Unique identifier field.
*  `FieldType.Number` - Any type of number
*  `FieldType.Phone` - Phone number 
*  `FieldType.Raw` - Flexible type that allows you to explicitly define the signature
*  `FieldType.Schema` - A way to point to other schemas
*  `FieldType.Select` - Specify a range of possible values (think enum)
*  `FieldType.Text` - Good ol' fashioned text field

## Relationships

The `FieldType.Schema` allows you to relate one schema to another.

## React component props & default props

## Creating a new FieldType

