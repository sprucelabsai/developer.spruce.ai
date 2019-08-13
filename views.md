# Views

A view is a window into your skill. It can be rendered as an `iframe` in a browser or as `UIWebView` on iOS (Android coming 2020'ish).

On most pages, Views are accessible through tabs:

![Skill Views](_images/skill-views.png?raw=true "Skill Views")

Pages are built using the [Heartwood](#heartwood) design system (which is totally ready for you to play with at [https://storybook.spruce.ai].)

## Skill View Pages

When you use `sprucebot skill create` as your starting point, you'll have a ton of placeholder view pages to get you started. Ultimately, rendering a skill view is a 2 steps to setting up a Skill View.

### Step 1: Event contracts

Uncomment the following block:

```js
'get-views': {
    description: 'Core asks for views to display on a page',
    subscribe: true
},
```

### Step 2: Setup your listener

Jump into `server/events/get-views.ts` and return a valid view configuration by modifying the switch. Oh, and also take some time to review this file:

```js

case 'dashboard_location`:
    views.push({
        id: 'my-page',
        title: 'Loyalty Points',
        host,
        path: `/skill-views/dashboard_location`
    })

    break

```

In this example `Case 'dashboard_location':` is referring to the `slug` for the Dashboard page on a location. Checkout [Core Pages](core-pages.md) to get an overview of pages where Skill Views can appear.

### Step 3: Create your skill view

All Skill Views will be found in `interface/pages/skill-views` in your skill. We recommend creating a directory that is the slug of the page you are rendered one.

```js
import React from "react";
import PageWrapper from "../../../containers/PageWrapper";
import { Page, Layout, Text } from "@sprucelabs/react-heartwood-components";

class DashboardLocationPage extends React.Component {
    componentDidMount() {
        this.props.skill.ready(); // Show the skill
    }

    render() {
        return (
            <Page title={{}}>
                <Page.Content>
                    <Layout>
                        <Layout.Section>
                            <Text>{`Welcome to the user dashboard example skill view!`}</Text>
                        </Layout.Section>
                    </Layout>
                </Page.Content>
            </Page>
        );
    }
}

export default PageWrapper(DashboardLocationPage);
```

## Heartwood

noun: the dense inner part of a tree trunk, yielding the hardest timber.

Heartwood is the design system you'll be using to build all your skill views. It's a library of flexible components that ensure visual and experiential consistency throughout the platform.

[Begin exploring Heartwood.](https://canary-storybook.sprucelabs.ai/?path=/story/page--page)

## Cookies

Because `nextjs` executes `getInitialProps` both server and client side, it's important to consider that when getting and setting cookies. This, unfortunately, takes 2 modules to handle: [cookies]() and [js-cookies]() have proven to work very reliably.

```bash
y add cookies
y add js-cookies
```

### Example

```js
import ServerCookies from 'cookies'
import ClientCookies from 'js-cookies'

class MySkillView extends React.Component<MySkillViewProps> {

    public static getInitialProps(ctx: Record<string, any>) {

        const {req, res, isServer} = ctx

        const token = 'go-team!'

        // instantiate a new cookie that can work both server and client side
        if (isServer) {
            const cookies = new ServerCookies(req, res, {
                secure: true,
                httpOnly: false
            })
            cookies.set('token', token)
        } else {
            ClientCookies.setItem('token', token)
        }
    }

    public static componentDidMount() {
        // always hits client side
        const token = ClientCookies.getItem('token')
        console.log(token, 'go-team')
    }
}
```
