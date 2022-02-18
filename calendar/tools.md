# Calendar Tools

Whether you are creating tools for your own Tool Belt, or the Tool Belt from another event (remote tool), you gotta follow the steps below.

---

## 1. Creating your own calendar tool

A `Tool` is just a `Card` that renders in the [Tool Belt](../toolBelt/index.md). The difference is that your tool will implement the `CalendarTool` interface.

This interface is built to handle State Machine context changes on the calendar. 

***Here's how you should approach writing your tool tests:***

1. Write your tests as if you're not a tool to get all the functionality in.
   * The only difference is you need to use `CalendarToolTestFactory.Tool(...)` instead of `this.Controller(...)` to create your views
1. Make sure your tool populates as expected based on context returned from `getContext()` sent to the constructor.
2. Make sure your tool updates as expected when `handleUpdateContext(context)` is invoked on your vc.
3. Make sure your tool invokes `updateContext` whenever changes need to be propagated to the calendar and other tools 


**Note:** Use `getPersonFromEvent()` passed to the constructor of your tool to get the person off the calendar event (not event.target.personId). This may return null, so write tests accordingly.

This is pretty close to how your test will end up (note, this test does not show how to use `getPersonFromEvent()`:

```ts
export default class EventTitleToolTest extends AbstractSpruceFixtureTest {
	private static vc: EventTitleToolViewController
	private static context: CalendarToolBeltContext

	private static get formVc() {
		return this.vc.getFormVc()
	}

	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()

		const { stateMachine, toolBeltVc } =
			CalendarToolBeltStateMachineTestFactory.StateMachine(this.views)

		this.sm = stateMachine
		this.context = this.sm.getContext()
		this.vc = this.Vc()
	}

	@test()
	protected static rendersForm() {
		const formVc = vcAssert.assertCardRendersForm(this.vc)
		assert.isEqual(formVc, this.formVc)
	}

	@test()
	protected static formRendersExpectedFields() {
		vcAssert.assertFormRendersFields(this.formVc, ['title', 'subtitle'])
	}

	@test()
	protected static doesNotRenderSubmitButtons() {
		assert.isFalse(this.formVc.shouldShowSubmitControls())
	}

	@test('starts with event context 1', {
		title: 'hey',
		subtitle: 'there',
	})
	@test('starts with event context 2', {
		title: 'go',
		subtitle: 'team',
	})
	protected static isPopulatedWithEventFromContext(expected: any) {
		this.context.event.timeBlocks[0].title = expected.title
		this.context.event.timeBlocks[0].subtitle = expected.subtitle

		this.vc = this.Vc({
			context: this.context,
		})

		const values = this.formVc.getValues()
		assert.isEqualDeep(values, expected)
	}

	@test()
	protected static doesNotThrowIfBadContextSent() {
		this.Vc()
	}

	@test('editing form calls update context 1', {
		title: 'taco',
		subtitle: 'bravo',
	})
	@test('editing form calls update context 2', {
		title: 'little',
		subtitle: 'burrito',
	})
	protected static async editingFormCallsUpdateContext(updates: any) {
		let wasHit = false
		let passedUpdates: any

		this.vc = this.Vc({
			updateContext: async (context) => {
				wasHit = true
				passedUpdates = context
			},
		})

		assert.isFalse(wasHit)
		await this.formVc.setValues(updates)
		assert.isTrue(wasHit)

		const { event } = this.context

		event.timeBlocks[0].title = updates.title
		event.timeBlocks[0].subtitle = updates.subtitle

		assert.isEqualDeep(passedUpdates, {
			event,
		})
	}

	@test()
	protected static async callingHandleContextUpdateUpdatesTheForm() {
		const { event } =
			await calendarToolBeltInteractor.simulateRandomContextUpdate(
				this.sm,
				this.vc
			)

		const values = this.formVc.getValues()
		assert.isEqualDeep(values, {
			title: event.timeBlocks[0].title,
			subtitle: event.timeBlocks[0].subtitle,
		})
	}


	private static Vc(options?: Partial<CalendarToolOptions>) {
		return CalendarToolTestFactory.Tool(this.sm, 'calendar.event-title-card', {
			updateContext: async () => {},
			getPersonFromEvent: () => login.getPerson(),
			...options,
		}) as EventTitleToolViewController
	}

}
```

Production code:

```ts
export default class EventTitleToolViewController
	extends AbstractViewController<Card>
	implements CalendarTool
{
	public static id = 'event-title-card'
	private cardVc: CardViewController
	private formVc: FormVc
	private getContext: GetCalendarToolBeltContextHandler
	private updateContextHandler: UpdateCalendarToolBeltContextHandler

	public constructor(options: ViewControllerOptions & CalendarToolOptions) {
		super(options)

		const { getContext, updateContext, getPersonFromEvent } = options

		this.getContext = getContext
		this.updateContextHandler = updateContext
		this.getPersonFromEvent = getPersonFromEvent

		this.formVc = this.FormVc()
		this.cardVc = this.CardVc()
	}

	private CardVc(): CardViewController {
		return this.Controller('card', {
			body: {
				sections: [
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private FormVc(): FormVc {
		return this.Controller(
			'form',
			buildForm({
				schema: formSchema,
				shouldShowSubmitControls: false,
				onChange: () => this.handleChangeForm(),
				sections: [
					{
						fields: ['title', 'subtitle'],
					},
				],
				values: {
					title: this.getContext().event?.timeBlocks?.[0]?.title,
					subtitle: this.getContext().event?.timeBlocks?.[0]?.subtitle,
				},
			})
		)
	}

	private async handleChangeForm() {
		const { event } = this.getContext()

		event.timeBlocks[0] = {
			...event.timeBlocks[0],
			...this.formVc.getValues(),
		}

		return this.updateContextHandler({
			event: {
				...event,
			},
		})
	}

	public async handleUpdateContext(
		context: CalendarToolBeltContext
	): Promise<void> {
		await this.formVc.setValues({
			title: context.event.timeBlocks[0].title,
			subtitle: context.event.timeBlocks[0].subtitle,
		})
	}

	public getFormVc(): FormVc {
		return this.formVc
	}

	public render() {
		return this.cardVc.render()
	}
}

```


## 2. Providing remote tools

If you want to drop a tool inter the Tool Belt for an event type a different skill provides, you can do the following:

1. Listen to `calendar.register-event-tools`
2. Return the ids of view controllers for all the tools you want
3. Create your tool (just an AbstractViewController<Card>)
4. Implement `RemoteCalendarTool` interface how you see fit
5. Follow the test instructions above


```bash
spruce add.listener --namespace calendar
```

## Notes

1. If you are trying to get the person off an event, use `getPersonFromEvent()` that is passed to the constructor of your tool. Don't use `event.target.personId` as the person tied to an event might be different than the person the event is targeting. `getPersonFromEvent()` is implemented by the skill creator and may do other lookups, like finding a client vs a teammate.
2. When building a tool, use `CalendarToolTestFactory.Tool(...)` instead of `this.Controller(...)` so your tool gets all the required params sent to it's constructor.