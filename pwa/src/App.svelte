<script lang="ts">
  interface Exercise {
    id: number;
    name: string;
    createdAt: string;
  }

  let exercises: Exercise[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  async function fetchExercises() {
    try {
      const response = await fetch(`${apiUrl}/exercises`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      exercises = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to fetch exercises';
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    fetchExercises();
  });
</script>

<main>
  <h1>Exercises</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else if exercises.length === 0}
    <p>No exercises found.</p>
  {:else}
    <ul>
      {#each exercises as exercise}
        <li>{exercise.name}</li>
      {/each}
    </ul>
  {/if}
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  h1 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .error {
    color: #c00;
  }
</style>
