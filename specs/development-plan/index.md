# Development plan

## Goals

### Epic 1 - setup
- [Goal 1: API Returns Data](epic-1-setup/goal-1-api-returns-data.md)
- [Goal 2: PWA Setup](epic-1-setup/goal-2-pwa-setup.md)
- [Goal 3: Dev Tooling](epic-1-setup/goal-3-dev-tooling.md)
- [Goal 4: Auth](epic-1-setup/goal-4-auth.md)
- [Goal 5: Styling](epic-1-setup/goal-5-styling.md)

### Epic 2 - exercise library
- [Goal 1: exercise library](epic-2-exercise-library/goal-1-data-models.md)
- [Goal 2: routines](epic-2-exercise-library/goal-2-routines.md)

### Epic 3 - workouts
- [Goal 1: User can enter their body weight](epic-3-workouts/goal-1-enter-user-bodyweight.md)
- [Goal 2: Start and finish workout](epic-3-workouts/goal-2-start-finish-workout.md)
- [Goal 3 - Workout sets](./epic-3-workouts/goal-3-sets.md)
- delete workout

## Backlog
### Features
- delete workout from workouts page
- if user navigates away from workout page, during workout
- when clicking Finish workout, show workout summary page and confirm / discard / back buttons
- link to workouts page from home page

### Other
- Netlify should deploy only after CI passes ([possible solution](https://www.google.com/search?q=how+do+I+get+netlify+to+wait+for+github+actions+checks+to+pass))
- E2E tests - Cypress
- visual design
  - dark / light mode?
- service worker / caching
- install PWA prompt
