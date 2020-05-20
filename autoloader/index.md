# Autoloader
Instantiate entire directories at once with full typing, sibling visibility, and key based access.
```bash
# Create a new autoloader based on a name, like services or adapters
spruce autoloader:create [namePlural]

Options: 
	-p, --pattern		 	Any pattern you want to use for loading files

	-s, --suffix			  Only loads files that end with this suffix
	
	-l, --lookupDir		   If creating based on existing dir, this is that dir.

	-d, --destination		 Where should I save generated autoloader for all the files in this directory?

	-rd, --rootDestination	Where should I save the root autoloader?

# Update autoloaders based on changes (deleting or adding files)
spruce autoloader:sync

# Create new root autoloader
spruce autoloader:root

Options: 
```

## Building your first autoloader
You need utilities, admit it!

```bash
spruce autoloader:create utilities
```

<!-- panels:start -->****
<!--div:title-panel-->
## Generated files
<!-- div:left-panel -->
After running `spruce autoloader:create` up to 4 files were created for you.

1. **Example abstract class:** `.src/{{nameCamelPlural}}/Abstract{{nameCamel}}.ts`
   1. The start of an abstract class that others will extend
   2. Extends `IAutoloadable`
<!-- div:right-panel -->
<!-- tabs:start -->
### ** 1. Autoloader **
aououaoe
### ** 1. Root Autoloader **
satoheusnatoheu
<!-- tabs:end -->
<!-- panels:end -->