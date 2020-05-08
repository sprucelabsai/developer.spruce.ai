# Errors

```bash
# Create a new error definition
spruce error:create [name]

Options:
	-n, --name					The name of the error you want to define
	-dd, --destinationDir 		Where should I write the error file? (internal use)
	-td, --typesDestinationDir	Where should I write the types file? (internal use)


# Update all type files to match the your error definitions
spruce error:sync [lookupDir]

Options:
	-l, --lookupDir				Where should I look for definitions files (*.definition.ts)?
	-d, --destinationDir		   Where should I write the definitions file?
	-td, --typesDestinationDir	 Where should I write the definitions file?
	-dd, --errorDestinationDir	 Where should I write the Error class file?
	-c, --clean					Clean output directory before generating errors, deleting old files.
```

## Building your first error

Lets start by creating your first error! Run
```bash
spruce error:create "You must be 18 or older"
```
After the command finishes, lets take a look at the generated files.

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce error:create` up to 4 files were created for you. 

1. **Definition:** `./errors/{{camelName}}.definition.ts`
    * Where the actual definition lives
    * Extends `ISchemaDefinition`, so you already know how it works!
    * Make your changes and run `spruce error:sync` to update the interface files
2. **Error subclass**: `./errors/Error.ts`
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
```js
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

```js
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
				message = `You are not 18! ${options.suppliedBirthDate} is not\n`
				message += `Try running spruce --help`
				break

			default:
				message = super.friendlyMessage()
		}

		return message
	}
}

```

#### ** 3. Options **

```js
// the options for the YouMustBe18OrOlder error
import {
	SchemaDefinitionValues
} from '@sprucelabs/schema'

import youMustBe18OrOlderDefinition from '../../src/errors/youMustBe18OrOlder.definition'
import { ISpruceErrorOptions } from '@sprucelabs/error'
import { ErrorCode } from './codes.types'

type UserNotFoundDefinition = typeof userNotFoundDefinition
export interface IUserNotFoundDefinition extends UserNotFoundDefinition {}

export interface IUserNotFoundErrorOptions extends SchemaDefinitionValues<IUserNotFoundDefinition>, ISpruceErrorOptions<ErrorCode> {
	/** * .UserNotFound - Could not find a user */
	code: ErrorCode.UserNotFound
} 
```
<!-- tabs:end -->
<!-- panels:end -->