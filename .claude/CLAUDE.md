
[Project spec](../specs/spec.md)

[Technical approach and specs](./technical/index.md)

[Development plan](./development-plan/goal-1-api-returns-data.md)

## Rules
- when asked to open a URL, always use Chrome devtools MCP server
- when researching and installing NPM libraries, always use the latest stable major version
- only add code comments if the code is not self-explanatory. Favour descriptive variable names and readable code, over code comments
- don't use non-null assertions
- prefer to extend / re-use existing type interfaces rather than duplicating to new ones
- any new functionality must be covered by unit tests
- do not use `any` in typescript
- Run the `lint` and `type-check` NPM tasks after completing code changes

### API
- after any changes to the Prisma schema, regenerate the Prisma Client

### PWA
- keep each Vue component in its own folder. Keep utility functions out of Vue component files. If the utility function is re-usable, move it to the pwa/src/utils folder. If it's specific to that component then move to a helpers.ts file in that component's folder
- always prefer to use existing utility class for styling rather than creating new classes in page-level CSS modules
- always use the CSS variables and utility classes from pwa/src/styles for fonts, colours and spacing 
- don't hardcode pixel values for width, spacing or font size in page-level CSS modules
- Vue component files .vue should contain only Vue-specific concerns  (state management, user interaction, routing) - any business logic should be in a helpers.ts file in the same folder and separately unit tested in isolation   
- any changes made to .vue component files should always be accompanied by integration test coverage.

#### Tests
UI tests using DOM testing library queries, should favour `getByRole` over `getByText` eg when looking for headings or links.

