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
import { sortTimezoneChoices } from '@sprucelabs/spruce-calendar-utils'
const schemaWithSortedTimezones = sortTimezoneChoices(this.locale, personSchema, 'timezone')

```

Here is the implementation of `sortTimezoneChoices` so you can get an idea of how it works.

```ts
import { cloneDeep, Schema, SchemaFieldNames } from '@sprucelabs/schema'
import { timezoneChoices } from '@sprucelabs/spruce-core-schemas'
import TimezoneChoiceSorter from '../locales/TimezoneChoiceSorter'
import { Locale } from '../types/calendar.types'

export default function sortTimezoneChoices<S extends Schema>(
	locale: Locale,
	schema: S,
	fieldName: SchemaFieldNames<S>
) {
	const sorter = new TimezoneChoiceSorter(locale)
	const choices = sorter.sort(timezoneChoices)

	const copy = cloneDeep(schema)

	const field = copy.fields?.[fieldName]

	if (field) {
		field.options = {
			...field.options,
			choices,
		}
	}

	return copy
}

```

Coming soon...


## Currencies

Coming soon...

## Languages

Coming soon...