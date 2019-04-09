# General Migration Notes

- Skills now run on node 10 (previously ran on node 8)

# Initial CLI setup

- Use node 10

`nvm install 10`

- Set node 10 as default

`nvm alias default 10`

## Uninstall old sprucebot cli

We've namespaced our packages so let's ensure that the old cli is not installed

`npm uninstall -g sprucebot-cli`

`yarn global remove sprucebot-cli`

## Install latest sprucebot cli

`npm i -g @sprucelabs/sprucebot-cli@latest`

# Verify your cli version

`sprucebot --version`

Ensure that the version you're using is 2.6.0 or greater

# Upgrade a skill

`cd /path/to/skill`

`rm -rf node_modules`

`nvm use 10`

`sprucebot skill update`

- Choose the "beta" release

- Choose the merge method of "reject" - this will create `.rej` files with anything that git was not automatically able to merge

- The cli will list the `.rej` files. You should go through each of these and manually compare what has changed to the existing files, updating accordingly.

  - In most cases you will not want to update pages or components since you will have already created custom UI elements specific to your skill

  - If you need to list the `.rej` files again you can run the command: `find . -type f -name '*.rej'`

  - Once you're finished you can remove the `.rej` files using a similar find command: `find . -type f -name '*.rej' -delete`

# Other Notes

- After upgrading, check out the `.env.example` file to see new environment variables that may need to be added.

## Env variables

- _IMPORTANT:_ Add new environment variable when running locally: `ENV=local`. This is checked for in the config and allows the project to be run from the `src/` directory (instead of the `build/` directory). This uses `flow-node` to run the project locally since we've introduced the ability to use [Flow](https://flow.org/) in skills.

  - Note that flow in skills kit is still an experimental feature and may not be supported long-term. We're also evaluating the use of [typescript](https://www.typescriptlang.org/). However, it's simple to remove flow annotations from files (this is what `yarn build:strip-flow` does) so migrating to something else in the future is trivial.
