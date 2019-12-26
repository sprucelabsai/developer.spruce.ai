# GraphQL

REST is dead! Or at least, gone the way of the fax. [GQL](https://graphql.org) is a fast and flexible way to build out your API's.

Skills rely on a few libraries to get you up and running (you don't really need to know them, but it help to be familiar with them):

- [graphql](https://github.com/graphql/graphql-js) - The base library for all things node+graphql
- [graphql-relay](https://github.com/graphql/graphql-relay-js) - Brings relay support to the platform
- [graphql-sequelize](https://github.com/mickhansen/graphql-sequelize) - Connects Sequelize models with relay making GQL endpoints pretty easy
- [graphql-tag](https://github.com/apollographql/graphql-tag) - For nicely format

## Setting up Visual Studio Code

## Defining your own types

There are 2 types that exist in skills.

Those based on Sequelize models and those that are not.

### Based on a Sequelize model

This is perfect for if you want to mainline right into a dabatase with minimal effort. Make sure you have the [ORM](orm.md) up and running, your model created, and [scopes](orm.md?id=defining-scopes) defined.

#### Step 1: Create your Type file

This is the GQL type that will represent your data model. Create a file that matches the name of your model inside of `services/gql/types`, e.g. `services/gql/types/ModelName.ts`

```js
import { ISkillContext } from "../../interfaces/ctx";
import { GraphQLObjectType } from "graphql";

export default (ctx: ISkillContext) =>
  new GraphQLObjectType({
    name: "ModelName",
    description: "This is a description of my model",
    fields: () => ({
      ...ctx.gql.helpers.attributes(ctx.db.models.ModelName)
    })
  });
```

#### Step 2: Set the types the context

### Custom type
