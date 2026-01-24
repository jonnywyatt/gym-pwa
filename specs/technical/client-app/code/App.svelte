<!-- src/App.svelte -->
<script lang="ts">
  import Router from 'svelte-spa-router';
  import { routes, conditionsFailed } from './routes';
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} />
