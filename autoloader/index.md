# Autoloader
Instantiate entire directories at once with full typing, sibling visibility, and key based access.
```bash
# Create a new autoloader based on a directory
spruce autoloader:create [name]

Options: 
	-p, --pattern		 	Any pattern you want to use for loading files

	-s, --suffix			  Only loads files that end with this suffix
	
	-l, --lookupDir		   If creating based on existing dir, this is that dir.

	-d, --destination		 Where should I save generated autoloader for all the files in this directory?

	-rd, --rootDestination	Where should I save the root autoloader?

# Create new root autoloader
spruce autoloader:root

Options: 


```