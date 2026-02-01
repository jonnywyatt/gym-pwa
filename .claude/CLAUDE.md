
[Project spec](../specs/spec.md)

[Technical approach and specs](./technical/index.md)

[Development plan](./development-plan/goal-1-api-returns-data.md)

## Rules
- when asked to open a URL, always use Chrome devtools MCP server
- when researching and installing NPM libraries, always use the latest stable major version
- only add code comments if the code is not self-explanatory. Favour descriptive variable names and readable code, over code comments
- keep each Vue component in its own folder. Keep utility functions out of Vue component files. If the utility function is re-usable, move it to the pwa/src/utils folder. If it's specific to that component then move to a helpers.ts file in that component's folder
