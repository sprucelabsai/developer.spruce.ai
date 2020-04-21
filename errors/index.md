# Errors

```
spruce error:create
```

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
Up to 4 files were created for you. 

1. **Definition:** `./errors/{{camelName}}.definition.ts`
    * Where the actual definition lives.
    * Extends `ISpruceSchemaDefinition`, so you already know how it works!
2. **Error subclass**: `./errors/Error.ts`
    * The error class that extends `AbstractSpruceError` from `@sprucelabs/error`
3. **Options**: `./.spruce/errors/options.types.ts`
    * The error options definitions. How Typescript infers type (using `code` field)
4. **Codes**: `./.spruce/errors/codes.types.ts`
    * All the error code enums (`ErrorCode.{{PascalName}}`)
<!-- div:right-panel -->
<!-- tabs:start -->
#### ** 1. Definition **
```js
// errors/invalidParameters.definition.ts

import { FieldType } from '@sprucelabs/schema'
import { buildErrorDefinition } from '@sprucelabs/error'

const genericDefinition = buildErrorDefinition({
	id: 'invalidCommand',
	name: 'Invalid command',
	description: "The command you ran was not found, try `spruce --help`.",
	fields: {
		args: {
			type: FieldType.Text,
            label: 'Arguments',
            isArray: true
		}
	}
})

export default genericDefinition
```

#### ** 2. Error subclass **

```js
import AbstractSpruceError from '@sprucelabs/error'
import { ErrorCode } from '../.spruce/errors/codes.types'
import { ErrorOptions } from '../.spruce/errors/options.types'

export default class SpruceError extends AbstractSpruceError<ErrorOptions> {
	/** an easy to understand version of the errors */
	public friendlyMessage(): string {
		const { options } = this
		let message
		switch (options?.code) {
			// invalid command
			case ErrorCode.InvalidCommand:
				message = `Invalid command: ${options.args.join(' ')}\n`
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
import AbstractSpruceError from '@sprucelabs/error'
import { ErrorCode } from '../.spruce/errors/codes.types'
import { ErrorOptions } from '../.spruce/errors/options.types'

export default class SpruceError extends AbstractSpruceError<ErrorOptions> {
	/** an easy to understand version of the errors */
	public friendlyMessage(): string {
		const { options } = this
		let message
		switch (options?.code) {
			// invalid command
			case ErrorCode.InvalidCommand:
				message = `Invalid command: ${options.args.join(' ')}\n`
				message += `Try running spruce --help`
				break

			default:
				message = super.friendlyMessage()
		}

		return message
	}
}

```
<!-- tabs:end -->
<!-- panels:end -->