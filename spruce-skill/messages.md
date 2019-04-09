# Messages

Messaging is how Sprucebot communicates with humans. Sprucebot currently has 2 means of messaging, `sms` and `push`. Luckily, you don't have to worry about how the `message` is delivered, you just send it.

In order to keep Sprucebot spam free, `messages` are tied to a `Location` so we can ensure a physical visit has ocurred.

While sending a message to a `user` whose `status === 'offline'` is allowed, abuse of this feature will result in banishment... forever.

Sending a `message` to a `guest` should be a last resort. It is much better to send a message to a `teammate` to have them deliver the `message`. It's the human-to-human contact of this type of interaction that makes what we are all doing so unique.

## API

```js
// Send a message
const message = await ctx.sb.message(locationId: UUID4, userId: UUID4, message:
 String, {
    linksToWebView: Bool, // optional (true|false)
    webViewQueryData: Object, // optional (query string sent to skill when user taps it)
    payload: Object // optional, anything else you want to pass through to the messaging layer
});
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