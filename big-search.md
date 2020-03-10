# Big Search

Whenever a person needs to find anything in the platform, Big Search is the answer.

There are 3 was to invoke Big Search

1. Using the search box in the upper right of the platform.spruce.ai
2. From a skill using `this.props.skill.search()`
3. From the mobile app by the tapping `Users` tab

![Big Search Example](../_images/big-search.gif?raw=true "Big Search Example")

## Providing your own search results

### Step 1: Enable event contract

Jump into your skill's `config/default.ts` and uncomment the following section:

```json
'big-search': {
    description: 'Provide your own search results in the platform',
    subscibe: true
},
```

### Step 2: Create your listener

Jump into `server/events/big-search.ts`, review the example, and make the changes you need to return the results you want.

In order for the example script to work,you'll need to have `DB_ENABLED=true`.

When your event listener is hit, it will come with the following event payload:

-   `ctx.event.payload`
    -   `limit`: `number` - How to limit search results
    -   `offset`: `number` - How many search results to skip
    -   `search`: `string` - Whatever the person typed into Big Search
    -   `testing`: `boolean` - If this is being run in a test environment, can be ignored for now

#### How to structure your response

Big Search renders results in sections. Your skill can respond with it's own sections and they'll be rendered as tabs.

![Big Search Tabs Example](../_images/big-search-tabs.png?raw=true "Big Search Tabs Example")

From your `big-search` listener, you need to return an array of `BigSearchSection`s. To see the defined interface, check `server/types.ts` in your skill.

-   `BigSearchSection`

    -   `title`: `string` - Rendered as the tab name in the search results
    -   `section`: `string` - The id/slug of the section. This may be passed to the `big-search` event to tell you to only return results for this section.
    -   `totalCount`: `number` - Total number of results, for paging
    -   `results` : `BigSearchResult[]` - An array of search results

-   `BigSearchResult`
    -   `id`: `string` - The id of this result. Will be passed to `import-from-big-search` event if the result is clicked. If your id is a number, typecast it to a string, eg `\`\${id}\``
    -   `title`: `string` - Rendered in the title of the list item
    -   `subtitle`: `string` (optional) - Shown beneath the title in the list item. Make it something helpful for the team!
    -   `action`: `Record<string, any>` - Details on how to handle the clicking on the result
        -   `type`: `string` ('coreRedirect' | 'import') - If you know this search result is already in core, set this to`coreRedirect`. If your search result is from an external system and you need to import them, set to`import`.
        -   `page` : `string` (optional) - The [page](core-pages.md) slug to redirect them to. For instance, if you want to send the person doing the searching to the user they clicked on's profile, you would set this to `profile_user_location` or `profile_user_org`.
        -   `routeParams`: `Record<string, string>` - A key/value pair that is used to populate the route you are sending the user to. The [Core Pages](core-pages.md) section shows you what params are needed by which pages.

#### Example

This is pulled from `server/events/big-search.ts` when you create a new skill.

```js
const { eventError } = require("../lib/errorHandler");

import type {
    IBigSearchCtx,
    IBigSearchSection,
    IBigSearchResult
} from "../types";

const BIG_SEARCH_TYPES = {
    ANY: "any",
    USER: "user",
    LOCATION: "location",
    GROUP: "group"
};

module.exports = async (ctx: IBigSearchCtx, next: Function) => {
    try {
        console.log("****big-search", ctx.auth.Organization.name);

        const {
            auth: { Organization: organization, Location: location },
            event: {
                payload: { limit, offset, search, testing, types }
            }
        } = ctx;

        // each section
        const sections: IBigSearchSection[] = [];

        // Here is how you could search the core using any rules if types was any or user
        if (
            types.indexOf(BIG_SEARCH_TYPES.ANY) > -1 ||
            types.indexOf(BIG_SEARCH_TYPES.USER) > -1
        ) {
            const { count, rows } = await ctx.db.models.User.findAndCountAll({
                where: {
                	firstName: search,
                }
                limit,
                offset
            });

            const section1: IBigSearchSection = {
                title: "Core Search Results Example",
                section: "internal",
                totalCount: count,
                results: rows.map(
                    (user: Object): IBigSearchResult => ({
                        id: user.id,
                        title: `${user.firstName} ${user.lastName}`,
                        subtitle: ``,
                        action: {
                            type: "coreRedirect",
                            page: location
                                ? "profile_user_location"
                                : "profile_user_org",
                            routeParams: {
                                userId: user.id,
                                organizationId: organization.id,
                                locationId: location && location.Id
                            }
                        }
                    })
                )
            };

            sections.push(section1);
        }

        // or you can search any source you want and mark them as needing to be imported
        // you can't import people unless there is a location, so make sure to check one is set
        if (location) {
            const dummyResults: IBigSearchResult[] = [];

            for (let c = 0; c < 100; c++) {
                dummyResults.push({
                    id: `${c}`,
                    title: `Dummy User ${c}`,
                    subtitle: `I am #${c}`,
                    action: {
                        type: "import"
                    }
                });
            }

            const section2: IBigSearchSection = {
                title: "Results to import",
                section: "external",
                totalCount: dummyResults.length,
                results: dummyResults.slice(offset, offset + limit)
            };

            sections.push(section2);
        }

        ctx.body = sections;

        await next();
    } catch (e) {
        eventError({
            ctx,
            next,
            e
        });
    }
};
```

## Importing search results

When you return any search result with `action.type` equal to `import`, you'll need to handle importing the search result yourself.

### Step 1: Enable event contract

Back to your skill's `config/default.ts` and uncomment the following section:

```json
'import-from-big-search': {
    description: 'Give people the power import your search results into the platform',
    subscibe: true
},
```

### Step 2: Create your listener

Take a look at `server/events/import-from-big-search.ts` to get started.
When your event listener is hit, here is the event payload:

-   `ctx.event.payload`
    -   `id`: `string` - The id you sent back with your search results so you can fetch the record again
    -   `matchId`: `UUID4` (optional) - An optional existing record in core the person searching wants you to update (vs doing a new import)
    -   `section`: `string` - The section the person doing the search was viewing. Will match a `BigSearchSection` from the `big-search` event
    -   `testing`: `boolean` - If core is in test mode. Can safely be ignored for now.

#### How to structure your response

Importing has 2 expected outcomes. First is succes. Second is stopped due to possible match. Here is how that respons looks:

-   `ImportBigSearchResult`
    -   `successfulImport`: `BigSearchResult` (optional) - An object that matches a `BigSearchResult` like the ones returned from the `big-search` event.
    -   `matchGroup`: `ImportBigSearchMatchGroup` (optional) - If you tried to import a record but found some possible matches and want the person doing the search to decide which match to update.
-   `ImportBigSearchMatchGroup`
    -   `matchGroupTitle`: `string` - The title of the dialog that handles the matches
    -   `matchGroupDescrription`: `string` - Some instructions you can put in the dialog, make them informative!
    -   `importingRecordLabel`: `string` - The label that sits above the record we are impoting!
    -   `matches`: `ImportBagSearchMatch[]` - An array of possible matches. Similar to a `BigSearchResult` without `action`.
-   `ImportBigSearchMatch`
    -   `id`: `UUID4` - The UUID4 of the possible match you found in core
    -   `title`: `string` - Whatever you need rendered for the ttile of the match
    -   `subtitle`: `string` (optional) - Rendered beneath the title
    -   `image`: `string` (optional) - The Url to an image you want to render

![Big Search Match Example](../_images/match-group.jpg?raw=true "Big Search Match Example")

#### Example

This is pulled from `server/events/import-from-big-search.ts` when you create a new skill.

```js
// @flow
const { eventError } = require("../lib/errorHandler");

import type { IImportFromBigSearchCtx, IImportBigSearchResult } from "../types";

module.exports = async (ctx: IImportFromBigSearchCtx, next: Function) => {
    try {
        console.log("****import-from-big-search", ctx.auth.Organization.name);

        const {
            auth: { Organization: organization, Location: location },
            event: {
                payload: { id, matchId, section, testing }
            }
        } = ctx;

        // if you have more than one section, this won't work
        if (section !== "external") {
            ctx.body = { ignore: true };
            return;
        }

        const response: IImportBigSearchResult = {
            successfulImport: undefined,
            matchGroup: undefined
        };

        // Step 1. Load the record from the Id that was clicked
        // for this example, we'll create a dummy one
        let phoneNumber = `5555${id}`;
        phoneNumber = `+1 555-555-${phoneNumber.slice(-4)}`;

        const selectedRecord = {
            id,
            firstName: `Dummy ${id}`,
            lastName: `User`,
            phoneNumber
        };

        // Step 2. did they pass a matchId? if so, we're just going to update that user
        if (matchId) {
            const updatedUser = await ctx.sb.updateUser(matchId, {
                firstName: selectedRecord.firstName,
                lastName: selectedRecord.lastName
            });

            response.successfulImport = {
                id: updatedUser.id,
                title: `${updatedUser.firstName} ${updatedUser.lastName}`,
                subtitle: "Go team!",
                image: updatedUser.profileImages
                    ? updatedUser.profileImages.profile150
                    : updatedUser.defaultProfileImages.profile150,
                action: {
                    type: "coreRedirect",
                    page: "profile_user_location",
                    routeParams: {
                        organizationId: organization.id,
                        locationId: location.id,
                        userId: updatedUser.id
                    }
                }
            };
        } else {
            // Step 2.1. If they did not pass a match id, lets make sure this user doesn't already exist (searching by phone is the most reliable way)
            // you can search by anything you want and read more at https://developer.spruce.ai
            const matches = await ctx.db.models.User.findAll({
                where: {
                    phoneNumber: selectedRecord.phoneNumber
                }
            });

            // Step 2.2 - if we did not find a match, lets add them to core
            if (matches.length === 0) {
                try {
                    const userLocation = await ctx.sb.createUser({
                        firstName: selectedRecord.firstName,
                        lastName: selectedRecord.lastName,
                        phoneNumber,
                        locationId: location.id
                    });

                    response.successfulImport = {
                        id: userLocation.User.id,
                        title: `${userLocation.User.firstName} ${userLocation.User.lastName}`,
                        subtitle: "Go team!",
                        action: {
                            type: "coreRedirect",
                            page: "profile_user_location",
                            routeParams: {
                                organizationId: organization.id,
                                locationId: location.id,
                                userId: userLocation.User.id
                            }
                        }
                    };
                } catch (err) {
                    log.warn("User creation failed");
                    throw new Error("UNKNOWN_ERROR");
                }
            } else {
                // Step 2.3 - we found a match, let the user decide if they want to merge
                response.matchGroup = {
                    matchGroupTitle: "Merge user?",
                    matchGroupDescription:
                        "I think we found a possible match in the system. Check out below!",
                    matchingRecordLabel: "Guest",
                    importingRecordLabel: "Dummy User",
                    matches: matches.map(match => ({
                        id: match.id,
                        title: match.name,
                        subtitle: null,
                        image: match.profileImages
                            ? match.profileImages.profile150
                            : match.defaultProfileImages.profile150
                    }))
                };
            }
        }

        ctx.body = response;

        await next();
    } catch (e) {
        eventError({
            ctx,
            next,
            e
        });
    }
};
```
