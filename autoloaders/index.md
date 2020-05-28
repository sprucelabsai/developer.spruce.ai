# Autoloaders
Build, type, and organize code for teams and scale.
```bash
# Create a new autoloader based on a name, like services or adapters
spruce autoloader:create [name]

Options: 
	-p, --pattern <string>		 	  Any pattern you want to use for loading files
							             Default: `**/!(*.test).ts`

	-l, --lookupDir <path>	           If creating based on existing dir, this is that dir.

	-d, --destination <path>		     If supplied [name], this is where I will create the scaffolding files
									     Default: `.src/{{name}}`

	--autoloaderDestination <path>	   Where should I save the new autoloader?
										 Default: `#spruce/autoloaders/`

	--rootAutoloaderDestination <path>   Where should I save the root autoloader?
										 Default: `#spruce/autoloaders/`

# Update autoloaders based on changes (deleting or adding files)
spruce autoloader:sync

# Create new root autoloader based on all autoloaders
spruce autoloader:root [destination]

```

## Building your first autoloader
You need utilities, admit it!

```bash
spruce autoloader:create utilities
```

<!-- panels:start -->
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce autoloader:create` up to 4 files were created for you.

1. **Abstract boilerplate:** `.src/{{nameCamelPlural}}/Abstract{{nameCamel}}.ts`
   1. The start of an abstract class that others will extend
   2. Extends `IAutoloadable`
2. **Class boilerplate:**: `.src/{{nameCamelPlural}}/Example{{nameCamel}}.ts` 
   1. Gets you started with a class that extends the abstract class
3. **Autoloader**
   1. Exports async function from `#spruce/autoloaders/{{nameCamelPlural}}.ts`
4. **Root autoloader**
   1. Exports async function from `#spruce/autoloaders/index.ts`
   2. Autoloader of autoloaders
<!-- div:right-panel -->
<!-- tabs:start -->
### ** 1. Abstract boilerplate **
```ts
// .src/utilities/AbstractUtility.ts

import { IAutoLoadable, IAutoloaded } from '#spruce/autoloaders'
import { IUtilities } from '#spruce/autoloaders/utilities'

export interface IUtilityOptions {
	/* Define your constructor options here */
	favoriteColor: string
}

/** Lots of helpful things **/
export default abstract class AbstractUtility implements IAutoLoadable {
	public utilities!: IUtilities
	public favoriteColor: string

	public constructor(options: IUtilityOptions) {
		console.log(options)
		this.favoriteColor = options.favoriteColor
	}

	/** invoked after everything is autoloaded */
	public async afterAutoload(autoloaded: IAutoloaded) {
		this.utilities = autoloaded.utilities
	}
}

```
### ** 2. Class boilerplate **
```ts
// .src/utilities/ExampleUtilities
import AbstractUtility, { IUtilityOptions } from './AbstractUtility'

export default class ExampleUtility extends AbstractUtility {
	public constructor(options: IUtilityOptions) {
		super(options)
		console.log(options)
	}
	public hello() {
		return `the world is ${this.favoriteColors}`
	}
}

```
### ** 3. Autoloader **
```ts
// import autoloader
import autoloader, { IUtility } from '#spruce/autoloaders/utilities'

// these options will be passed to each utility when instantiated
const options = { favoriteColor: 'blue' }

// load all utilities
const utilities = autoloader({ constructorOptions: options })
console.log(utilities.example.hello()) // the world is blue

// load select utilities
const { exampleUtility } = autoloader({ 
	constructorOptions: { favoriteColor: 'black' },
	only: [IUtility.Example] 
})

console.log(exampleUtility.hello()) // the world is black

```
### ** 4. Root autoloader **
```ts
// import the autoloader
import rootAutoloader from '@spruce/autoloaders'

// loading your entire skill
let skill = rootAutoloader({ 
	examples: {
		constructorOptions: { favoriteColor: 'red' }
	}
})

console.log(skill.utilities.example.hello()) // the world is red

```
<!-- tabs:end -->
<!-- panels:end -->

## Autoloading your code

As your skill grows, you'll end up with a lot of code being autoloaded. The [`spruce-cli`](https://github.com/sprucelabsai/spruce-cli-workspace/tree/dev/packages/spruce-cli/src) itself uses autoloaders extensively. 

You will use create autoloaders for all types of things:

* Utilities
* Services
* Adapters
* Stores

## Adding/deleting files
Any time you add or delete a file, you gotta run sync:
```bash
spruce autoloader:sync
```

## Adapter pattern
Autoloaders are perfectly suited for facilitating the creation and usage of adapters.

For this example, lets say you connecting to a face recognition platform to trigger the `did-enter` event.

You want to be able to test different face detection APIs and to be able to change at any time. And you will not be giving an organization control over the API used. Note: This is probably the wrong way to do this since you usually want to give the organization control over as much as possible (especially enterprises).

Let's get started!

```bash
spruce autoloader:create faceAdapters
````

You may create a few face detection adapters:

* .src/faceAdapters
	* AbstractFaceAdapter.ts
	* AwsFaceAdapter.ts
	* MicrosoftFaceAdapter.ts
	* WatsonFaceAdapter.ts

After you create your face detection adapters, lets update the autoloaders
```bash
spruce autoloader:sync
```
We need a way to save api settings that our skill can load. So, lets create a `.env` and drop in some variables:

```env
DETECTION_ADAPTER=aws
DETECTION_ADAPTER_OPTIONS={ "key": "3092384092834", "secret": "234234234" }
```

Next, lets hook into the boot of our skill to configure the adapter.

```bash
spruce events:handle did-boot
```
Now lets load the selected face detection adapter based off an environmental variable.
```ts
// src/events/did-boot/handler.ts

// import the autoloader
import faceAdapters, { FaceAdapter } from '#spruce/autoloaders/faceAdapters'

export default function (spruce: ISpruce) {

	// fall back to aws if no preference is set
	const preferredAdapter = spruce.env.DETECTION_ADAPTER ?? 'aws'
	const adapterOptions = JSON.encode(spruce.env.DETECTION_ADAPTER_OPTIONS ?? {})

	// instantiate the adapter
	const { [preferredAdapter]: adapter  } = await faceAdapters({ 
		constructorOptions: adapterOptions, 
		only: [ FaceAdapter[preferredAdapter] ]
	})

	// whatever work the adapter needs to do to make the platform ready
	adapter.init(...)

	// make it available in listeners
	spruce.faceDetection = adapter
}

```

## Strategy pattern

Since the strategy pattern is about choosing options at run-time, we wouldn't do our work in the did-boot event.


