
[Project spec](../specs/spec.md)

[Technical approach and specs](./technical/index.md)

[Development plan](./development-plan/goal-1-api-returns-data.md)

## Rules
- when asked to open a URL, always use Chrome devtools MCP server
- when researching and installing NPM libraries, always use the latest stable major version
- only add code comments if the code is not self-explanatory. Favour descriptive variable names and readable code, over code comments
- don't use non-null assertions

### PWA
- keep each Vue component in its own folder. Keep utility functions out of Vue component files. If the utility function is re-usable, move it to the pwa/src/utils folder. If it's specific to that component then move to a helpers.ts file in that component's folder
- always prefer to use existing utility class for styling rather than creating new classes in page-level CSS modules
- always use the CSS variables and utility classes from pwa/src/styles for fonts, colours and spacing 
- don't hardcode pixel values for width, spacing or font size in page-level CSS modules
