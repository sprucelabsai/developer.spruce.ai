# Building your first skill

Sprucebot here, ready to get you rocking.⚡️️️
To get started, you gotta get the [sprucebot-cli](https://github.com/sprucelabsai/sprucebot-cli). It's really easy!

```bash
yarn global-add sprucebot-cli
sprucebot skill create
```

## Experience Architecture

![Architecture](../_images/Architecture.png?raw=true "Architecture")

## Skill Architecture

## Debugging

This kit comes with a `.vscode` folder with a `launch.json` configured for debugging with [Visual Studio Code](https://code.visualstudio.com). Simply open this project in vscode, jump to the Debug Pane, select "Debug" and hit the green Play button.

![Debug](../_images/debug.jpg?raw=true "Debug")

#### Visual Studio Code Launch Configurations

-   `Attach` - Will launch the debugger and attach to process already running. This would be if you ran `yarn local` from another terminal and wanted to start debugging.
-   `Debug` - Starts the skill (runs `yarn local`) and attaches the debugger immediately.
-   `Mocha (Test single file)` - Lets you run all the tests in a single [test](spruce-skill/tests) file.

#### Debugging without VS Code

When you run `yarn local`, by default your skill will listen for a debugger on port `4080`. You can attach the debugger of your choosing by connecting to that port.

## File Structure

-   `.vscode` - Settings for `Visual Studio Code`, our preferred IDE
-   `config` - Per environment settings, managed via [config](https://github.com/lorenwest/node-config)
-   `coverage` - Testing courtesy [Jest](https://facebook.github.io/jest/). No need to touch anything here.
-   `docs` - All the docs you could ever want!
-   [`interface`](interface.md) - Holds your React pages. Powered by [Nextjs](https://github.com/zeit/next.js/).
    -   `.next` - Caching for Nextjs.
    -   `components` - Anything reusable that will not contain much (if any) logic.
    -   `.containers` - Logic containing `components`. Most of the time a `container` will render one or more `components`, passing `props` down.
    -   `lang` - Language control.
    -   `pages` - Each page of your `interface`. Rendered using Nextjs.
    -   `store` - `Actions` and `reducers`. Powered by [react-redux](https://github.com/reactjs/react-redux)
        -   `actions` - Where your `https` requests are made (or state is changed in any way).
        -   `reducers` - How your app handles those `https` requests (or state changes).
-   `node_modules` - You know this one.
-   [`server`](server.md) - Backend powered by [spruce-skill-server](https://github.com/sprucelabsai/spruce-skill-server) + [koajs](http://koajs.com).
    -   `controllers` - Where your routes are defined.
        -   `1.0` - Helps to version your controllers
            -   `guest` - All routes available to `guests`, `teammates`, and `owners`.
            -   `owner` - All routes only available to `owners`.
            -   `teammate` - Routes for `teammates` and `owners`
        -   `cron.js` - Drop in logic that runs on a schedule.
    -   `events` - All your event listeners.
    -   `middleware` - Koajs middleware.
    -   `models` - Models brought to you by [Sequelize](http://docs.sequelizejs.com).
    -   `services` - Anything that is a long running, or I/O based operation, drop it in a `service`.
    -   `static` - Host your flat files here. Available at `/${filename}`.
    -   `utilities` - Any bit of code you need to use often that is synchronous.
    -   `server.js` - Hands control over to `spruce-skill-server`.
-   `.babelrc` - Transpiling code.
-   `.editorconfig` - Holds our formatting preferences.h
-   `.env.example` - Your starter `.env` file.
-   `.eslintrc` - Our [eslint](https://eslint.org) preferences. Formats code automatically!
-   `.gitignore` - Files we don't want included in version control.
-   `.nvmrc` - For user with [nvm](https://github.com/creationix/nvm) so we can always be using the same version of node.
-   `.travis.yml` - Continuous integration with [Travis CI](https://travis-ci.org).
-   `package.json` - Dependencies n' such.
-   `README.md` - Readme about your skill.

# What's next?

Now that you're up and running, dive into the [`server`](server.md) guide to get yourself familiar with the backend.
