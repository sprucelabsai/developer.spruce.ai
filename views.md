# Views

## Skill View Pages

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
