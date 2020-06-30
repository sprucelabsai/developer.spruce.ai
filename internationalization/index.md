# Internationalization
```bash
# Add support for a new language
spruce language.add [name]

```

# Languages

lang/2020-02/welcomeMessage.definition.ts
```typescript
key: 'welcomeMessage',
defaultTemplate: {
	en_us: 'Hey {{user.friendlyName}}'
},
context: {
	fields: {
		
	}
}
```

```typescript
const message = await this.utilities.lang.compile('welcomeMessage', { locationId, context })
```

## Date formats


```typescript
const prettyDate = await this.utilities.date.format(incomingDate, { locationId })
```

## Currencies

```typescript
const prettyCurrency = await this.utilities.currency.format(incomingCurrency, { locationId })
```