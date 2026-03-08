
[Project spec](../specs/spec.md)

[Technical approach and specs](./technical/index.md)

[Development plan](./development-plan/goal-1-api-returns-data.md)

## Environment
- At the start of every session, run `source ~/.zshrc && nvm use` to ensure the Node.js version matches `.node-version` before running any npm or node commands

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
- before writing any CSS module class, check `pwa/src/styles/` for an existing utility class that covers it. The available utility files are: `flex.css` (flex layouts), `spacing.css` (margin/padding), `cards.css` (card layouts), `buttonsLinks.css` (buttons/links), `lists.css`, `type.css` (typography), `grid.css`. Only create a new CSS module class if no existing utility class covers the need.
- page-level CSS module classes are only appropriate for: custom input/form styling, component-specific pseudo-selectors (e.g. `:focus`, `:hover` on unique elements), or structural styles that have no global equivalent. Do NOT create module classes just for flex layout, gap, margin, or padding — use the global utility classes instead.
- always use the CSS variables from `pwa/src/styles/variables.css` for fonts, colours and spacing
- don't hardcode pixel values for width, spacing or font size in page-level CSS modules
- Vue component files .vue should contain only Vue-specific concerns  (state management, user interaction, routing) - any business logic should be in a helpers.ts file in the same folder and separately unit tested in isolation   
- any changes made to .vue component files should always be accompanied by integration test coverage.

#### Tests
UI tests using DOM testing library queries, should favour `getByRole` over `getByText` eg when looking for headings or links.

