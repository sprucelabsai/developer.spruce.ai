

# Schemas
Define, validate, and normalize everything.
```bash
# Create a new schema definition
spruce schema:create [name]

Options: 
	-dd, --definitionDestinationDir <path>	 Where should I write the definition file?
									   		Default: `./src/schemas`

	-td, --typesDestinationDir <path>		  Where should I write the types file?
									   		Default: `#spruce/schemas`

# Update all type files to match your schema definitions
spruce schema:sync [lookupDir]

Options:
	-l, --lookupDir <path>	 	            Where should I look for definitions files (*.definition.ts)?
								   	        Default: `.src/errors`

	-d, --destinationDir <path>		        Where should I write the types files?
								   	        Default: `#spruce/schemas`

	-c, --clean						        Where should I clean out the destination dir?

	-f, --force						        If cleaning, should I suppress confirmations and warnings

# Extend an existing model
spruce schema:extend [namespace] [name]

```
<!-- panels:start -->
<!-- div:left-panel -->

## Define
A location, a schedule, an appointment, or even a button; all these things exist outside the constructs of a platform. Schemas allow us to define things once and share those definitions with everyone else building on the platform. 

## Validate

A valid email is a valid email and you should never have to write `isValidEmail` code again! By having a standardized way of handling data validation, we ensure if it's been written, you don't have to rewrite it.

## Normalize

Are you familiar with `google-libphonenumber`? No? Good. Here's my promise, you'll never have to write a phone number formatter again!



<!-- div:right-panel -->
<!-- tabs:start -->

#### ** Define **

```ts
// ./src/schemas/shirt.definition.ts

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

```ts
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

```ts
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

Lets start by defining a Ball. From that, we'll create a sub-schemas and a related schema.

```bash
spruce schema:create "Ball"
spruce schema:create "Soccer ball"
spruce schema:create "Vendor"
```

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce schema:create` up to 3 files were created for you.
****
1. **Definition:** `./src/schemas/{{nameCamel}}.definitions.ts`
   * Where your new definition lives
   * After making changes, run `spruce schema:sync` to update interface files
2. **Types:** `#spruce/schemas/schemas.types.ts`
   * Where all interfaces live
   * Accessible through `SpruceSchemas`
   * `const adidas: SpruceSchemas.Local.IVendor = { name: 'adidas' }`
3. **Normalized Definition:** `#spruce/schemas/local/{{nameCamel}}.definition.ts`
   * Strictly typed
   * This is the version of your definition that is shared across skills
<!-- div:right-panel -->
<!-- tabs:start -->
#### ** 1. Definition **
```ts
// ./src/schemas/vendor.definition.ts

import Schema, { FieldType, buildSchemaDefinition } from '@sprucelabs/schema'

const vendorDefinition = buildSchemaDefinition({
    id: 'vendor',
    name: 'Vendor',
    description: 'A vendor is a company that makes balls',
	fields: {
		id: {
            type: FieldType.Id,
            label: 'Id',
			isRequired: true,
        },
        name: {
            type: FieldType.Text,
            label: 'Name',
            hint: 'How they are incorporated',
        }
    }
})

export default vendorDefinition
```
#### ** 2. Types **
Has both Core and Local types and definitions
```ts
// #spruce/schemas/schemas.types.ts

export namespace SpruceSchemas.Local {
	/** Profile images at various helpful sizes and resolutions. */
	export interface IProfileImage {
		/** Id. */
		id: string
		/** Name. How they are incorporated */
		name?: string | undefined | null
	}
}
```
<!-- tabs:end -->
<!-- panels:end -->

## Updating definitions

We'll start by defining our Vendor schema since it's required for the ball schemas.

```ts
// ./src/schemas/vendor.definition.ts

import Schema, { FieldType, buildSchemaDefinition } from '@sprucelabs/schema'

const vendorDefinition = buildSchemaDefinition({
    id: 'vendor',
    name: 'Vendor',
    description: 'A vendor is a company that makes balls',
    fields: {
		id: {
			type: FieldType.Id,
			label: 'Id',
		},
        name: {
            type: FieldType.Text,
			label: 'Weight',
			hint: 'In ounces',
            options: {
               min: 0
            }
		}
    }
})

export default vendorDefinition


```
Lets define the fields for the "base" definition that all balls will mixin.
```ts
// ./src/schemas/ball.definition.ts

import Schema, { FieldType, buildSchemaDefinition } from '@sprucelabs/schema'

// import the related definition
import vendorDefinition from './vendor.definition'

const ballDefinition = buildSchemaDefinition({
    id: 'ball',
    name: 'Ball',
    description: 'All balls extend this ball',
    fields: {
		id: {
			type: FieldType.Id,
			label: 'Id',
		},
        weightOz: {
            type: FieldType.Number,
			label: 'Weight',
			hint: 'In ounces',
            options: {
               min: 0
            }
		},
		color: {
			type: FieldType.Select,
			label: 'Color',
			options: {
				choices: [
					{ value: 'red', label: 'Red'}
					{ value: 'green', label: 'Green'},
					{ value: 'blue', label: 'Blue'}
				]
			}
		},
		vendor: {
			type: FieldType.Schema,
			label: 'Vendor',
			isRequired: true,
			options: {
				schema: vendorDefinition
			}
		}
    }
})

export default ballDefinition

```

Now lets define our sub-schema that will extend a Ball.
```ts

// ./src/schemas/soccerBall.definition.ts

import Schema, { FieldType, buildSchemaDefinition } from '@sprucelabs/schema'

// import the "parent" schema definition
import ballDefinition from './ball.definition'

const soccerBallDefinition = buildSchemaDefinition({
    id: 'soccerBall',
    name: 'Soccer ball',
    description: 'A ball that is kicked.',
    fields: {
		// mixin all ball fields
		...ballDefinition.fields,
        color: {
			// preserve color field props
            ...ballDefinition.fields.color,
            options: {
				// preserve color field options
			   ...ballDefinition.fields.color.options,
			   choices: [
				   // preserve color choices but add in a new one
				   ...ballDefinition.fields.color.options.choices,
				   { value: 'blackAndWhite', label: 'Black and white'}
			   ]
            }
		}
    }
})

export default soccerBallDefinition

```

After you are done editing your definitions you'll need to sync the type files.

```bash
spruce schema:sync
```

## Extending definitions

There is no concept of inheritance in schemas and their definitions. Instead, as you see in the examples above, schemas use a mixin approach with the `...spread` operator.

## Using your definitions (instantiating schemas)

I make it really easy to import a definition from anywhere.

`import { SpruceSchemas } from '#spruce/schemas/schemas.types'`

All your definitions will are located at `SpruceSchemas.Local`.

```ts
import { SpruceSchemas } from '#spruce/schemas/schemas.types'
import Schema from '@sprucelabs/schema'

// create a vendor and pass values on instantiation
const vendor = new Schema(SpruceSchemas.Local.Vendor, { name: 'Adidas' })

// create a soccer ball
const ball = new Schema(SpruceSchemas.Local.SoccerBall)

// set values
ball.set('vendor', vendor.getValues())
ball.set('color', 'blackAndWhite')

// should pass
if (ball.isValid()) {
	console.log('great work')
}

```

## Schema class API

The `Schema` class uses definitions for data validation and normalization. Putting a `Schema` behind your REST, GQL, or Mercury events ensures world class validation and error reporting in an instant.

* `constructor`	
  * `definition`: [ISchemaDefinition](https://github.com/sprucelabsai/spruce-schema/blob/dev/src/schema.types.ts#L42) - the definition to base this schema on. You can pass it as an object literal or pull it off `SpruceSchemas`
  * `values`: [SchemaDefinitionPartialValues<definition>]()




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

```ts
let vendor = new Schema(SpruceSchemas.Local.Vendor, { name: 'Adidas' })

// create a soccer ball
const ball = new Schema(SpruceSchemas.Local.SoccerBall)

// set the vendor
ball.set('vendor', vendor.getValues())

// get the vendor back
vendor = ball.get('vendor')

```

## React component props & default props

## Creating a new FieldType

## Core definitions

## Versioning