# Polish

Test the finishing touches on your skill!

---

```bash
# Add polish to your skill project
spruce setup.polish

```

## Polish script

Your skills polish script can be found at `src/{{namespace}}.polish.ts`

The default script has a working example of a polish run for the heartwood skill.

## Running Polish

```bash
# Running polish
yarn polish

```

If all steps have passed the command will return `0`, otherwise it will return `1`

## ENV Variables

- `BASE_URL` - Base url defaults to: `https://spruce.bot`
- `HEADLESS` - set to HEADLESS=false to watch the steps as they are performed

```bash
# Example Usage
BASE_URL=https://dev.spruce.bot HEADLESS=false yarn polish

```

## Action Steps

- Click

```ts
# to click a button
{
	click: {
		target: [['Button', 'primary']],
	},
},


# to click a dialog confirm
{
	click: {
		target: [['Dialog', 'primary']],
	},
},


# to click a navMenu (the calendar icon)
{
	click: {
		target: [['NavMenu', 'calendar']],
	},
},


# to click a link under a navMenu,
{
	click: {
		target: [['NavLink', 'appointments']],
	},
},


```

- Redirect

```ts
# to redirect to a different skill view controller
{
	redirect: {
		id: 'calendar.root',
	},
},
```

- Type Text

```ts
# To type text into an input field named 'firstName'
{
	typeText: {
		target: [['Field', 'firstName']],
		text: 'Spruce',
	},
},
```

## Assertion Steps

```ts
# to assert a text input value
{
	assert: {
		target: [['Field', 'firstName']],
		inputValue: {
			equals: 'Spruce',
		},
	},
},

# to assert title on the present slide
{
	assert: {
		target: ['Card'],
		presentSlide: {
			titleEquals: 'Select armor',
		},
	},
},

# to assert the slideIdx on the present slide (0 based!)
{
	assert: {
		target: ['Card'],
		presentSlide: {
			slideIdx: 1,
		},
	},
},

# to assert both a title & slideIdx on the present slide (0 based!)
{
	assert: {
		target: ['Card'],
		presentSlide: {
			titleEquals: 'Select armor',
			slideIdx: 1,
		},
	},
},
```
