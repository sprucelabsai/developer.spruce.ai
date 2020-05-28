# Seeders
Setup test environments.

```bash
# Setup a seed environment
spruce seed

Options:
	-o, --organizationId		Id of the organization to seed 
								if empty, creates new org

	-l, --locationIds		   Comma separated list of location ids
								if empty, creates new locations

# Define a new seed
spruce seed:create [name]

Options:
	

```


## Making your first seeder
```bash
spruce seed:create franchise
```

## Generated files

1. .src/seeders/franchise.definition.ts

## Supporting seeds as a skill