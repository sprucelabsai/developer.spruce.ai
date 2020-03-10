# Getting started

Sprucebot here!⚡️️️️️️️️️️️️

Starting your skill is really easy.

Use the [sprucebot-cli](https://github.com/sprucelabsai/sprucebot-cli).

```bash
yarn global add @sprucelabs/sprucebot-cli
sprucebot skill create
```

## Skill Stack


![Skill Architecture](../_images/skill-architecture.png?raw=true "Skill Architecture")

## Debugging

Each kit comes with a `.vscode` folder with a `launch.tson` configured for debugging with [Visual Studio Code](https://code.visualstudio.com). Simply open create a new project based off your skill's directory in vscode, jump to the Debug Pane, select "Debug" and hit the green Play button.

![Debug](../_images/debug.jpg?raw=true "Debug")

#### Visual Studio Code Launch Configurations

-   `Attach` - Will launch the debugger and attach to process already running. This would be if you ran `yarn local` from another terminal and wanted to start debugging.
-   `Debug` - Starts the skill (runs `yarn local`) and attaches the debugger immediately.
-   `Mocha (Test single file)` - Lets you run all the tests in a single [test](tests.md) file.

#### Debugging without VS Code

When you run `yarn local`, by default your skill will listen for a debugger on port `4080`. You can attach the debugger of your choosing to that port.

## File Structure

-   `.vscode` - Settings for `Visual Studio Code`, our preferred IDE
-   `config` - Per environment settings, managed via [config](https://github.com/lorenwest/node-config)
-   `docs` - Put the docs for your skill here!
-   `interface` - Holds your React pages. Powered by [Nextjs](https://github.com/zeit/next.ts/)
    -   `.next` - Caching for Nextjs
    -   `components` - Anything reusable that will not contain much (if any) logic.
    -   `containers` - Logic containing `components`. Most of the time a `container` will render one or more `components`, passing `props` down.
    -   `lang` - Language control
    -   `pages` - Each page of your `interface`. Rendered using Nextjs
    -   `styles` - Custom stylesheets, imported using `import '../styles/global.scss'` in any React page
-   `node_modules` - You know this one
-   `server`- Backend powered by [spruce-skill-server](https://github.com/sprucelabsai/spruce-skill-server) + [koajs](http://koajs.com)
    -   `controllers` - Where your routes are defined (deprecated in favor of `gql`)
        -   `cron.ts` - Drop in logic that runs on a schedule
    -   `events` - All your event listeners
    -   `gql` - Your graphql resolvers, connections, subscriptions, and types
    -   `lib` - Put the code that does work in here
    -   `migrations` - Your [Sequelize](http://docs.sequelizejs.com) migrations
    -   `models` - Models brought to you by [Sequelize](http://docs.sequelizejs.com)
    -   `services` - For communicating with at outside service or API
    -   `static` - Host your flat files here. Available at `/${filename}`
    -   `tests` - [Mocha](https://mochajs.org) tests and mock data
    -   `utilities` - Helpers and other small bits of reusable code
    -   `server.ts` - Hands control over to `spruce-skill-server`
-   `.babelrc` - Transpiling code
-   `.editorconfig` - Holds our formatting preferences
-   `.env.example` - Your starter `.env` file
-   `.eslintrc` - Our [eslint](https://eslint.org) preferences. Formats code automatically!
-   `.gitignore` - Files we don't want included in version control.
-   `.nvmrc` - For user with [nvm](https://github.com/creationix/nvm) so we can always be using the same version of node.
-   `.travis.yml` - Continuous integration with [Travis CI](https://travis-ci.org).
-   `package.tson` - Dependencies n' such.
-   `README.md` - Readme about your skill.

# What's Next?

We should start by building our first skill I think. Lets [dive in](spruce-skill/first)!
