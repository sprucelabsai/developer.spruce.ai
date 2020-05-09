# Errors
Build errors that solve problems.

```bash
# Create a new error definition
spruce error:create [name]

Options:
	-n, --name					The name of the error you want to define

	-dd, --destinationDir 		Where should I write the error file? 
								  Default: .src/errors

	-td, --typesDestinationDir	Where should I write the types file? 
								  Default: #spruce/errors


# Update all type files to match the your error definitions
spruce error:sync [lookupDir]

Options:
	-l, --lookupDir				Where should I look for definitions files (*.definition.ts)?
								   Default: .src/errors

	-d, --destinationDir		   Where should I write the definitions file?
								   Default: .src/errors

	-td, --typesDestinationDir	 Where should I write the types file?
								   Default: #spruce/errors

	-dd, --errorDestinationDir	 Where should I write the Error class file?
								   Default .src/errors

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

1. **Definition:** `./src/errors/{{camelName}}.definition.ts`
    * Where the actual definition lives
    * Extends `ISchemaDefinition`, so you already know how it works!
    * Make your changes and run `spruce error:sync` to update the interface files
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

		return message
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
            label: 'Supplied birth date'
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
import SpruceError from '../errors/SpruceError'
import { ErrorCode } from '#spruce/errors/codes.types'

throw new SpruceError({
	code: ErrorCode.YouMustBe18OrOlder,
	suppliedBirthDate: someUserSuppliedInput
})
```

## Catching an error
```ts
import { ErrorCode } from '#spruce/errors/codes.types'

try {
	assertOldEnough(someUserSuppliedInput)
} catch (err) {
	if (err instanceof SpruceError && err.options.code === ErrorCode) {
		console.log(err.friendlyMessage()) //
		console.log(err.options) // { code: 'YouMustBe18OrOlder', suppliedBirthDate: 1/1/10'}
	}
}
```