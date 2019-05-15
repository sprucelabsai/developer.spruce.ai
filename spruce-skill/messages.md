# Messages

Messaging is how Sprucebot communicates with humans. Sprucebot currently has 2 means of messaging, `sms` and `push`. Luckily, you don't have to worry about how the `message` is delivered, you just send it.

In order to keep Sprucebot spam free, `messages` are tied to a `Location` so we can ensure a physical visit has ocurred.

While sending a message to a `user` whose `status === 'offline'` is allowed, abuse of this feature will result in banishment... forever.

Sending a `message` to a `guest` should be a last resort. It is much better to send a message to a `teammate` to have them deliver the `message`. It's the human-to-human contact of this type of interaction that makes what we are all doing so unique.

## Message Types

To ensure that we appropriately message users at the right times (and to comply with various laws) we need to classify the messages that we're sending.  Currently there are 2 buckets of messages:

* Promotional Messages (`type=promotional`) - This is the default type of message and should be used when sending the user anything that they have not specifically requested to receive. Some examples include: sending a coupon, nudging the user to fill out additional information in the skill, telling the user about a new feature, etc. If you are unsure of what type of message you're sending, error on the side of marking it as "promotional"

* Transactional Messages (`type=transactional`) - This is a message that the user needs to know about and has specifically opted in to receive. Some examples include: notifying the user that their haircut has been cancelled, sending the user a summary of their weekly schedule **after they have opted-in to receive these messages**.  As a rule of thumb, a message should only be marked as transactional **if the user has the option to turn this type of message on or off in the skill's settings**.  Also, you should **never opt users in by default**. Instead, prompt the user to save their preferences on how and when they get sent notifications.

Behind the scenes, the Spruce platform considers transactional messages critical information that the user needs to know and will place fewer limits on sending these messages. Promotional messages on the other hand will be queued and delivered at opportune times with rate limiting. Promotional messages _might_ also never be delivered depending on user preferences and/or local laws.

Abusing the message system or inappropriate classification of messages will make users not want to use your skill and may have other penalties. Please be responsible.

## API

```js
// Send a message
const message = await ctx.sb.message(locationId: UUID4, userId: UUID4, message:
 String, {
    linksToWebView: Bool, // optional (true|false)
    webViewQueryData: Object, // optional (query string sent to skill when user taps it)
    payload: Object, // optional, anything else you want to pass through to the messaging layer
    type: string // optional ("promotional", "transactional"), default "promotional"
});
```

### Advanced Usage

Sometimes it might be useful to queue up multiple messages to send at a later time. For example in a cron you might be queuing up messages once a day that will be delivered to users throughout the rest of the day

```js
// Queue multiple messages to send in the future
const messages = await ctx.sb.queueMessages([{
    message: string, // required. The message to send
    sendAtTimestamp: number, // required. The unix timestamp of when to send this message
    locationId: string, // required. The location where the message is being sent from
    userId: string, // required. The user to send the message to
    linksToWebView: Bool, // optional (true|false)
    webViewQueryData: Object, // optional (query string sent to skill when user taps it)
    payload: Object, // optional, anything else you want to pass through to the messaging layer
    type: string // optional ("promotional", "transactional"), default "promotional"
}])

```

### Push Notifications

The example message above can be received by the user as a push notification via the Spruce mobile app. Without any further customization, the user will receive just the `message` string in the notification.

If you want to customize the push notification, simply add a `push` object to your message payload.

```js
// Basic notification
const payload = {
    push: {
        title: String,// optional
        subtitle: String,// optional
        body: String// optional, will override `message` argument
    }
}
```

Additionally, Spruce takes advantage of "Rich Notification" features on iOS.

```js
// Send an image, brief video clip or audio clip
// Media notification example:
const mediaPushPayload = {
    push: {
        title: "VIP Alert",
        body: "Alex Martinez just arrived at 1234 Main St",
        media: {
            url: "https://images.unsplash.com/photo-1501625277806-e25bd4596da3",
            fileName: "1501625277806.png"
        }
    }
}

// Send a notification with customizable "actions"
const actionsPushPayload = {
    push: {
        title: "This has some actions",
        body: "Just press on this notification to see the actions",
        actions: [
            {
                id: "action_one",
                label: "Action One",
                deepLink: "link_to_app_screen",// optional
                webUrl: "link_to_web"// optional, lower priority than `deepLink`
            },
            {
                id: "action_two",
                label: "Action Two",
                deepLink: "link_to_app_screen",// optional
                webUrl: "link_to_web"// optional, lower priority than `deepLink`
            }
        ]
    }
}

// Send a message as a user in an "iMessage" style UI
const messagePushPayload = {
    push: {
        title: "Lindsay Brockling",
        body: "Thanks so much again for the great service today. I can't wait for my next visit!",
        message: {
            user: {
                id: '00000001',
                name: 'Lindsay Brockling',
                profileImages: {
                    "profile60@2x": "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb"
                }
            },
            message: "Thanks so much again for the great service today. I can't wait for my next visit!"
        }

    }
}

// Send a Card as a notification:
const cardPushPayload = {
    push: {
        title: "Card Notification",
        card: {
            cardBuilder: {
                __typename: "CardBuilder",
                header: {
                    __typename: "CardHeader",
                    title: 'This is an example of a basic card.',
                    labelText: null,
                    labelIcon: null,
                    actions: null,
                    contextMenu: null
                },
                headerImage: null,
                onboarding: null,
                body: {
                    __typename: "CardBodyType",
                    isSectioned: false,
                    children: [
                        {
                            __typename: "CardBodyText",
                            type: 'text',
                            key: 'text',
                            text: 'Just a little bit of info for you just in case you needed it.',
                            props: null
                        }
                    ]
                },
                footer: {
                    __typename: "CardFooterActions",
                    actions: [
                        {
                            __typename: "Button",
                            key: 'key',
                            className: '',
                            kind: 'primary',
                            isSmall: false,
                            isFullWidth: false,
                            isLoading: false,
                            isIconOnly: false,
                            text: 'See the Event',
                            href: 'https://sprucebot.com',
                            type: null,
                            target: null,
                            icon: {
                                __typename: "IconType",
                                icon: 'foo',
                                isLineIcon: false,
                                className: ''
                            },
                            payload: {}
                        }
                    ]
                }
            }
        }
    }
}

```

## Gotchya's
 * `Messages` must be routed through a `Location`. This means there is no messaging a `user` who has not visited that `Location`. #nooutbound
 * To send a card, all potential props in card builder MUST be declared, even if null. (On roadmap to fix this in API, though.)
 * Focus your messaging on in-store experiences.
 * If you need to deliver a message to the `guest`, try notifying a `teammate` so they can deliver the message.
 * If you must message the `guest`, don't bombard them with messages (how much would you like to be spammed when you walk into a shop?)
 * DO NOT SPAM

# What's next?
Ok, lets dive into [error reporting](errors.md)!