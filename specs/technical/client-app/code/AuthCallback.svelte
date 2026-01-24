<!-- src/routes/AuthCallback.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { authService } from '../lib/auth/oauth';

  let error: string | null = null;

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      error = 'Authentication failed';
      return;
    }

    if (!code) {
      error = 'No authorization code received';
      return;
    }

    try {
      await authService.handleCallback(code);
      push('/'); // Redirect to home
    } catch (err) {
      error = err.message;
    }
  });
</script>

{#if error}
  <div class="error">
    <p>{error}</p>
    <a href="/login">Back to login</a>
  </div>
{:else}
  <div class="loading">
    <p>Completing sign in...</p>
  </div>
{/if}

<style>
  .error, .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
  }

  .error {
    color: #d32f2f;
  }
</style>
