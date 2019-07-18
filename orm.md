# ORM

Skills use [Sequelize](http://docs.sequelizejs.com) as their ORM. It'll help to understand how Sequelize works since this documentation only considers how it's implemented into skills.

## Enabling the ORM

When your ready to start using models, you'll need to enable database support in your `.env`.

```env
DB_ENABLED=true
DB_MIGRATIONS=true
ORM_LOGGING=true
```

-   `DB_ENABLED`: `boolean` - Enables database support which is required to work with data models
-   `DB_MIGRATIONS`: `boolean` - If enabled, [migrations](#migrations) will be run when your skill boots
-   `ORM_LOGGING`: `boolean` - Enables logging of all queries in your skill, which is helpful for debugging

## Core models

The following list of models are part of core that you're skill has access to that you can query against. Keep in mind some models are **read only** and to create or update them you'll need to check the [api](api.md).

You can find the core model files in the `server/models` directory.

### FileItem

_Read Only_

After you upload a file using the [`uploads`](upload.md) service, you can query for the it through the `FileItem` model.

-   Properties
    -   `id`: `UUID4` - ID of the file
    -   `name`: `string` - The name fo the file
    -   `mimeType`: `string` - The files [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
    -   `ext`: `string` - The files extension
    -   `type`: `string` - A human readable type of file, valid options are "image", "video", or "other"
    -   `meta`: `JSON` - An arbitrary object containing any additional information you want about the file
    -   `sizeBytes`: `bigint` - Size of the file it bytes
    -   `width`: `int` - If this file is a video or image, this is it's width
    -   `height`: `int` - If this file is a video or image, this is it's height
    -   `Location`: [`Location`](#location) - The location this file is tied to
    -   `Organization`: [`Organization`](#organization) - The organization this file is tied to
    -   `Guest`: [`User`](#user) - Any guest this file is related to
    -   `Teammate`: [`User`](#user) - Any teammate this file is related to

### Group

A group is a list of locations. There are a bunch of great reasons to use groups. For example, you could create a group called "East Coast" and put some locations in there. You could greate a group called "Pilot Group" and add locations who have agreed to test new features.

You can read more about groups [here](orgs-locations-groups.md).

-   Properties
    -   `id`: `UUID4` - The id of the group
    -   `name`: `string` - The name of this group
    -   `isDefault`: `boolean` - When an organization is created a an "All Locations" group is also created
    -   `Organization`: [`Organization`](#organization) - The organization this group belongs to
    -   `LocationGroups`: [[`LocationGroup`]](#locationgroup) - An array of `LocationGroup` models that link this group to locations
    -   `UserGroups`: [[`UserGroup`]](#usergroup) - An array of `UserGroup` models that link this group to [Group Managers](roles-jobs-permissions.md)
    -   `Locations`: [[`Location`]](#location) - An array of `Location` models setup as convenience to access locations in this group vs. having to work through the `LocationGroup` model

### Job

### Location

### LocationGroup

### Skill

### User

### UserGroup

### UserLocation

### UserOrganization

## Custom models

When you're ready to create your own models, keep in the mind the following:

-   Duplicate `server/models/.example` to get started
-   Create your file inside `server/models/ModelName.js`
-   Make sure your model's file name is `CamelCase.js`
-   When you boot your skill, your model's database table is created
-   If you change a property on a model after first boot, your database table is out of sync and you'll need to create a [migration](#migrations)

## Migrations

After you've begun working with models and decide to change the model's schema (adding, editing, or removing properties), you'll need to create a migration to update the corresponding table in the database.

To get started, make sure you've installed the [`sequelize-cli`](http://docs.sequelizejs.com/manual/migrations.html).

```bash
$ yarn global add sequelize-cli
$ sequelize migration:create --name <migration name>
```

**Gotchyas**:

-   Kill the skill while working on migrations or your skill will restart and auto-run.
-   Migrations only run once, so you'll need to create a new one or rename the file if you want it to run again.

## Relating to core models

```

```
