

# Schemas

Schemas serve 2 purposes:

1. A way to define, validate, and transform universal data structures and types
2. A universal way to define, validate, and transform data structures and types

<!-- panels:start -->
<!--div:title-panel-->
## Define
<!-- div:left-panel -->
A location, a schedule, an appointment, or even a button; all these things exist outside of skill and information about them may be shared between skills. By creating and sharing definitions, we all benefit from the awareness eachother brings to the platform.
<!-- div:right-panel -->
```js
import { ISchemaDefinition, FieldType } from '@sprucelabs/schema'

// define your thing
const shirtDefinition: ISchemaDefinition = {
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
}
```
<!-- panels:end -->

<!-- panels:start -->
<!--div:title-panel-->
## Validate
<!-- div:left-panel -->
A valid email is a valid email and you should never have to write `isValidEmail` code again! By having a standardized way of handling data validation, we ensure if it's been written, you don't have to rewrite it.
<!-- div:right-panel -->
```js
import log from 
import Schema from '@sprucelabs/schema'

// create a schema from the definition
const shirtSchema = new Schema(shirtDefinition);

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
const errors = shirtSchema.validate() // [{ fieldName: 'size', errors: ['invalid_phone_number']}]

```
<!-- panels:end -->

<!-- panels:start -->
<!--div:title-panel-->
## Transform
<!-- div:left-panel -->
Are you familial with `google-libphonenumber`? No? Good. Here's my promise, you'll never have to write a phone number formatter again! In fact, if you can think of, it probably already has a transformer/formatter.

<!-- div:right-panel -->
```js
const { FieldBase } from '@sprucelabs/schema'

// schemas use fields under-the-hood, but you can use them directly
const phoneNumberField = new FieldBase.field({
    type: FieldType.Phone
})

// transform to the fields value type (in this case, a nicely formatted string)
const phone = phoneNumberField.toValueType('7203332222')
console.log(phone) // +1 720-253-5250

// even validate directly
phoneNumberField.validate('232324234234234') // throws FieldValidationError

```
<!-- panels:end -->
## Importing definitions

I make it really easy to import a definition from anywhere. 

`import { userDefinition, jobDefinition } from 'spruce/definitions'`



```js
import { Schema } from '@sprucelabs/schema'
import { userDefinition } from 'spruce/definitions'

// pass the definition to a schema to leverage validation and transformation
const schema = new Schema(userDefinition)

// 


```

