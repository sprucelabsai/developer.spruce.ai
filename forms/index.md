# Forms
Build beautiful configuration screens using schemas and Heartwood.
****

## Building your first form
```ts

// build your schema, create using using the cli, or import one from somewhere!
const formSchema = buildSchema({
	id: 'profile',
	fields: {
		firstName: {
			type: 'text',
			label: 'First name',
			isRequired: true,
		},
        lastName: {
            type: 'text',
            isRequried: true
        }
	},
})

type FormSchema = typeof FormSchema

const formVc = this.Controller(
    'form',
    buildForm({
        id: 'profile',
        schema: formSchema,
        values: {
            firstName: 'Tay',
            lastName: 'Ro',
        },
        sections: [
            {
                fields: [
                    'firstName',
                    { name: 'lastName', renderAs: 'colorPicker' },
                ],
            },
        ],
    })
)


```

## Using the Person Select Input

1. You gotta bring in the Person Select Input:
```bash
yarn add @sprucelabs/spruce-people-utils
```
2. Import and mixin the `PersonSelectInputViewController`
```ts
public constructor(options: ViewControllerOptions) {
    super(options)
    this.mixinControllers({
        'people.person-select-input': PersonSelectInputViewController,
    })
}
```
3. Instantiate an input and tell the form to use it
```ts
this.personSelectInputVc = this.Controller('people.person-select-input', {})
this.formVc = this.Controller(
    'form',
    buildForm({
        schema: formSchema,
        sections: [
            {
                fields: [
                    {
                        name: 'person',
                        renderAs: 'autocomplete',
                        vc: this.personSelectInputVc,
                    },
                ],
            },
        ],
    })
)

```