# Internationalization (i18n)
Timezones, currencies, and languages, oh my!!


## Timezones

My builders worked REALLY hard to make sure you don't have to sweat timezones. When you're coding in the front end or back end, you can use the `dates` utility to work with dates that will automatically be set in the current person or location's [Locale](https://github.com/sprucelabsai/calendar-utils/blob/master/src/types/calendar.types.ts).

### From a skill view controller

```ts
public async load(options: SkillViewControllerLoadOptions<Args>) {
    const { locale } = options
    
    const offset = locale.getTimezoneOffsetMinutes()
    const name = locale.getZoneName()

    console.log({ offset, name })
}

```

### From a listener

Coming soon...

### Rendering timezone choices

Timezones can be frustrating because the offset can change based on time of year (DST vs STD). Here is a way to sort them based off their actual offset.

If you want to create a schema before feeding it into a form, you can use something like this:

```ts
const timezoneField = personSchema.fields.timezone
const choices = timezoneField.options.choices
const sorter = new TimezoneChoiceSorter(new LocaleImpl())

const schemaWithSortedTimezones = {
    ...personSchema,
    fields: {
        ...personSchema.fields,
        timezone: {
            ...timezoneField,
            options: {
                ...timezoneField.options,
                choices: sorter.sort(choices),
            },
        },
    },
}

```

Or, you can update the FormViewController after instantiation. Here is a small helper used in the Locations Skill that is helpful

```ts
import { Locale, TimezoneChoiceSorter } from '@sprucelabs/calendar-utils'
import { FormViewController } from '@sprucelabs/heartwood-view-controllers'
import {
	locationSchema,
	timezoneChoices,
} from '@sprucelabs/spruce-core-schemas'

export function sortLocationTimezones(
	formVc: Pick<FormViewController<any>, 'setField'>,
	locale: Locale
) {
	const sorted = new TimezoneChoiceSorter(locale).sort(timezoneChoices)

	formVc.setField('timezone', {
		fieldDefinition: {
			...locationSchema.fields.timezone,
			options: {
				choices: sorted,
			},
		},
	})
}


```

Coming soon...


## Currencies

Coming soon...

## Languages

Coming soon...