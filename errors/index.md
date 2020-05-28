# Errors
Flexible and informative error reporting.
****
```bash
# Create a new error definition
spruce error:create [name]

Options:
	-dd, --destinationDir 		Where should I write the error file? 
								  Default: `.src/errors`

	-td, --typesDestinationDir	Where should I write the types file? 
								  Default: `#spruce/errors`


# Update all type files to match the your error definitions
spruce error:sync

Options:
	-l, --lookupDir				Where should I look for definitions files (*.definition.ts)?
								   Default: `.src/errors`

	-d, --destinationDir		   Where should I write the definitions file?
								   Default: `.src/errors`

	-td, --typesDestinationDir	 Where should I write the types file?
								   Default: `#spruce/errors`

	-dd, --errorDestinationDir	 Where should I write the Error class file?
								   Default: `.src/errors`

	-c, --clean					Clean output directory before generating errors, deleting old files.
```

## Building your first error

Lets start by creating your first error!
```bash
spruce error:create "You must be 18 or older"
```
Now review the generated files before we jump into the definition itself.

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce error:create` up to 4 files were created for you. 

1. **Definition:** `./src/errors/{{nameCamel}}.definition.ts`
    * Where the actual definition lives
    * Extends `ISchemaDefinition`, so you already know how it works!
    * Make your changes and run `spruce error:sync` to update the interface files (if not already running `spruce watch`)
2. **Error subclass**: `./src/errors/Error.ts`
    * The error class that extends `BaseSpruceError` from `@sprucelabs/error`
    * Switch statement in `friendlyReason` to generate helpful error messages
3. **Options**: `#spruce/errors/options.types.ts`
    * The error option interfaces.
    * Holds options for all errors
4. **Codes**: `#spruce/errors/codes.types.ts`
    * All the error code enums (`ErrorCode.{{PascalName}}`)
<!-- div:right-panel -->
<!-- tabs:start -->
#### ** 1. Definition **
```ts
// errors/youMustBe18OrOlder.definition.ts

import { FieldType } from '@sprucelabs/schema'
import { buildErrorDefinition } from '@sprucelabs/error'

const genericDefinition = buildErrorDefinition({
	id: 'youMustBe18OrOlder',
	name: 'You must be 18 or older',
	description: "You aren't old enough!",
	fields: {
		suppliedBirthDate: {
			type: FieldType.Date,
            label: 'Supplied birth date'
		}
	}
})

export default genericDefinition
```

#### ** 2. Error subclass **

```ts
import BaseSpruceError from '@sprucelabs/error'
import { ErrorCode } from '../.spruce/errors/codes.types'
import { ErrorOptions } from '../.spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
	/** an easy to understand version of the errors */
	public friendlyMessage(): string {
		const { options } = this
		let message
		switch (options?.code) {
			// invalid command
			case ErrorCode.YouMustBe18OrOlder:
				message = `You are not 18! ${options.suppliedBirthDate} is too recent!`
				break;
			default:
				message = super.friendlyMessage()
		}


		// Drop on code and friendly message
		message = `${options.code}: ${message}`
		const fullMessage = `${message}${
			options.friendlyMessage ? `\n\n${options.friendlyMessage}` : ''
		}`

		// Handle repeating text from original message by remove it
		return `${fullMessage}${
			this.originalError && this.originalError.message !== fullMessage
				? `\n\nOriginal error: ${this.originalError.message.replace(
						message,
						''
				  )}`
				: ''
		}`
	}
}

```

#### ** 3. Options **

```ts
// the options for the YouMustBe18OrOlder error
import {
	SchemaDefinitionValues
} from '@sprucelabs/schema'

import youMustBe18OrOlderDefinition from '../../src/errors/youMustBe18OrOlder.definition'
import { ISpruceErrorOptions } from '@sprucelabs/error'
import { ErrorCode } from './codes.types'

type YouMustBe18OrOlderDefinition = typeof YouMustBe18OrOlderDefinition
export interface IYouMustBe18OrOlderDefinition extends YouMustBe18OrOlderDefinition {}

export interface IYouMustBe18OrOlderErrorOptions extends SchemaDefinitionValues<IYouMustBe18OrOlderDefinition>, ISpruceErrorOptions<ErrorCode> {
	/** * .YouMustBe18OrOlder - You aren't old enough */
	code: ErrorCode.YouMustBe18OrOlder
} 
```
<!-- tabs:end -->
<!-- panels:end -->

## Updating definitions

Once you create your error definition, you'll want to edit it. Jump into `./src/errors/youMustBe18OrOlder.definition.ts` and update the fields.

Since errors are defined using schemas, you can learn a lot more by reading the [Schema docs](/schemas/index.md).

```ts
// ./src/errors/youMustBe18OrOlder.definition.**ts**

import { FieldType } from '@sprucelabs/schema'
import { buildErrorDefinition } from '@sprucelabs/error'

const genericDefinition = buildErrorDefinition({
	id: 'youMustBe18OrOlder',
	name: 'You must be 18 or older',
	description: "You aren't old enough!",
	fields: {
		suppliedBirthDate: {
			type: FieldType.Date,
			label: 'Supplied birth date',
			isRequired: true
		},
		ipAddress: {
			type: FieldType.Text,
			label: 'IP address'
		}
	}
})

export default genericDefinition
```

After you are done, you'll need to run:

```bash
# Always run after updating error definitions
spruce error:sync
```
to ensure all the types are updated too.

## Throwing an error

```ts
// import Error class and error codes
import SpruceError from '../errors/SpruceError'
import { ErrorCode } from '#spruce/errors/codes.types'

throw new SpruceError({
	code: ErrorCode.YouMustBe18OrOlder,
	suppliedBirthDate: someUserSuppliedInput // only field that is required based on definition
})
```

## Catching an error

Catching an error is pretty simple, but since `SpruceError` was designed to be chained, you can throw more relevant errors while passing through 
```ts
import { ErrorCode } from '#spruce/errors/codes.types'

try {
	assertOldEnough(someUserSuppliedInput)
} catch (err) {
	// after checking if the error is a SpruceError you can check the error code
	if (err instanceof SpruceError && err.options.code === ErrorCode.YouMustBe18OrOlder) {
		console.log(err.friendlyMessage())
		console.log(err.options.suppliedBirthDate); // Typescript knows suppliedBirthDate is required
		console.log(err.options) // { code: 'YouMustBe18OrOlder', suppliedBirthDate: 1/1/10'}
	}

	// OR you can do a switch for the code
	if (err instanceof SpruceError) {
		switch(err.options.code) {
			case ErrorCode.YouMustBe18OrOlder:
				console.log(`NOT OLD ENOUGH: ${err.options.ipAddress ? `IP Address: ${err.options.ipAddress}` : ''}`)

				// chain this error with a new one with a more helpful message
				throw new SpruceError({ 
					code: ErrorCode.SignUpFailed, 
					originalError: err, 
					friendlyReason: 'Uh oh! I couldn\'t sign you up, check the following errors for more details.'
				})
				break
			case ErrorCode.SomeOtherError:
				console.log('Error!!')
				break
		}
	}
}
```
## Chaining errors
Every error has an `originalError` option that accepts an `Error`. You can see how the the "Error subclass" above mixes in the original error before returning `friendlyMessage`.

Here is how you you do it:

```ts
import SpruceError from '.src/errors/SpruceError'
import { ErrorCode } from '#spruce/errors/codes.types'

try {
	somethingThatThrows()
} catch (err) {
	throw new SpruceError({
		code: ErrorCode.SignUpFailed,
		originalError: err
	})
}

```

## Errors over the wire
All errors can be serialized to `Json` to make sharing them easy.

```ts
const err = new SpruceError({ 
	code: ErrorCode.SignUpFailed
})

return err.toJson()
```

You can parse the json and pass it to an error as options.

```ts
const options = JSON.parse(data)
const err = new SpruceError(options)
```

## Error failures