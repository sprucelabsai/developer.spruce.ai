# Roles, Jobs, & Permissions

The 3 of these concepts are what allow you to know the role a person plays in the store experience and what thay can/cannot do.

# Roles

The Spruce platform breaks people into 5 roles. These roles can apply to an Organization, a Group, or a Location.

-   `guest` - A person who visits a location. Someone with whom the business is building a relationship.
-   `teammate` - Someone who works at a location and manages the guest experience.
-   `manager` - A person who manages teammates. Can also directly interact with guests, but their main job is managing the teamate experience.
-   `groupManager` - Someone who manages a group of locations. Generally concerned with experience on a more hollistic level.
-   `owner` - The top level user. Usually assigned to actual business owners.

# Jobs

Coming soon...

# Permissions

Setting up permissions for your skill is a matter of jumping into `./config/acls.ts` and configuring them.

## ACL service

When it's time to check if a user has permission to do something, use the `acl` service!
work

-   `ctx.services.acl.getAcls({ userId, permissions, locationId, organizationId })`

    -   `userId` : `UUID4` - The user you are checking for permissions against.
    -   `permissions` : `Record<string, string[]>` - All the permissions you want to check where the key is `core` or a skill's `slug` and the values are an array of permissions.
    -   `organizationId`: `UUID4` - Always pass the organization to check perms agains.
    -   `locationId` : `UUID4` (optional) - If a permission is tied to a location, pass it's id.

### Example

```js
const {
    auth: { User: user, Organization: organization, Location: location }
} = ctx;

const {
    core: { can_invite_location_teammate, can_invite_location_guests },
    booking: { can_book_appointment_for_guest }
} = await ctx.services.acl.getAcls({
    userId: user.id,
    permissions: {
        core: ["can_invite_location_teammate", "can_invite_location_guests"],
        booking: ["can_book_appointment_for_guest"]
    },
    organizationId: organization.id,
    locationId: location.id
});

if (can_invite_location_teammate) {
    console.log("They can do eat!");
}
```
