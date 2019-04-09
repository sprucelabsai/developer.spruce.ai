# Spruce Skills Kit

Lerna workspace for managing skills kit dependencies

```
├── node_modules/
├── packages
│   ├── sprucebot-skills-kit
│   ├── sprucebot-skills-kit-server
│   ├── sprucebot-node
│   └── react-sprucebot
├── CHANGELOG.md
├── README.md
├── lerna.json
├── package.json
└── yarn.lock
```

## Setup

1. `git clone` this repo
1. `cd workspace.sprucebot-skills-kit`
1. `git clone` the repos defined in `package.json.workspaces[**]` _TODO - sprucebot-cli could do this for us and setup upstream branches etc_
1. `yarn install` to install all the dependencies defined in all the cloned workspaces
1. `cd packages/sprucebot-skills-kit && sprucebot skill register`
1. `cd ../../`
1. `yarn local` to start the skills kit using pm2

## Workspace Scripts Available

- `yarn local` - Start the pm2 ecosystem that starts the skills kit
- `yarn log` - Tail the pm2 ecosystem log
- `yarn stop` - Stop the skills kit server from `yarn local`

## Contributing

We use the [Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) to manage our semantic releases and changelog.

- Open Pull Requests to the `dev` branch
- Commits are automatically linted using `commitlint` with a husky git hook.
- [Commitizen](https://www.npmjs.com/package/commitizen) can easily configured to format commit message

## Semantic Releases

- We automatically release from `master` branch using [semantic-release](https://github.com/semantic-release/semantic-release) and [semantic-release-monorepo](https://github.com/Updater/semantic-release-monorepo)
- Changes to each `package/` are automatically detected and we only release packages with changes
- The angular commit messages used to determine if the changes are `patch`, `minor`, or `marjor`

| Commit message                                                                                              | Release type               |
| ----------------------------------------------------------------------------------------------------------- | -------------------------- |
| `fix(ticket): fix bug to create patch`                                                                      | Patch Release              |
| `feat(ticket): add new feature is a minor release`                                                          | ~~Minor~~ Feature Release  |
| `perf(ticket): remove graphiteWidth option`<br><br>`BREAKING CHANGE: This block will trigger major release` | ~~Major~~ Breaking Release |

#### Default rules matching

If a commit doesn't match any rule in `releaseRules` it will be evaluated against the.

With the previous example:

- Commits with a breaking change will be associated with a `Major` release.
- Commits with `type` 'feat' will be associated with a `minor` release.
- Commits with `type` 'fix' will be associated with a `patch` release.
- Commits with `type` 'perf' will be associated with a `patch` release.

#### No rules matching

If a commit doesn't match any rules in `releaseRules` then no release type will be associated with the commit.

With the previous example:

- Commits with `type` 'style' will not be associated with a release type.
- Commits with `type` 'test' will not be associated with a release type.
- Commits with `type` 'chore' will not be associated with a release type.

#### Multiple commits

If there is multiple commits that match one or more rules, the one with the highest release type will determine the global release type.

Considering the following commits:

- `docs(SB-xxx): Add more details to the API docs`
- `feat(SB-xxx): Add a new method to the public API`

With the previous example the release type determine by the plugin will be `minor`.

### Manual Release Process

The idea here is we need to rebase the changes in `dev` onto the `master` branch. Since we rely on commit messages in our `semantic-release`, we can't apply a merge commit.
The recommended flow is as follows assuming `master` is in synch with `dev`.

1. Developer opens a `feat|fix` PR
1. When the PR is approved, we can either `rebase` or `squash and merge` into `dev`
   1. Notice a new canary was released via `npm view sprucebot-skills-kit@prerelease`
1. Once dev is ready, we open a new PR from `dev` into `master`
1. Rebase `dev` into master, preserving commit messages
   1. Notice a new release was triggered `npm view sprucebot-skills-kit@latest`
1. Once `master` has released, rebase `master` back into `dev`
