<script>
  import { scale } from "svelte/transition";
  import headlong from "~matyunya/headlong";
  import { onMount, onDestroy, tick } from "svelte";
  import HomePage from "./HomePage.svelte";
  import Sheet from "./Sheet.svelte";
  import Logo from "./Logo.svelte";
  import Scrim from "./Scrim.svelte";
  import { sync } from "./sync.js";

  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let store;
  export let login = () => {};

  let page = "home";
  let unsub = () => {};
  let prefetching = false;

//   Uncomment to jump straight to the table
//   page = "cap-table";

  async function onAuthenticated(e) {
    prefetching = true;
    const { commit } = store;
    const { appData, profile } = e.detail;

    if (profile) store.commit((p) => ({ set }) => set('profile', p), profile);

    unsub = sync(appData, store, () => prefetching = false);

    page = "cap-table";
  }

  onDestroy(unsub);

  onMount(() => {
    // TODO: goto sheet if auth cookie present

    setTimeout(async () => {
      headlong();
      const el = document.getElementById('app');
      if (!el) return;

      el.classList.remove('hidden');
      el.classList.remove('opacity-0');
      await tick();
      el.classList.add('opacity-100');
    }, 50);
  });
</script>

{#if page === 'home'}
  <HomePage on:success={onAuthenticated} {login} />
{:else}
  {#if prefetching}
    <div class="h-full w-full absolute flex items-center justify-center">
      <div transition:scale={{ delay: 200 }}>
        <Logo animated size={64} />
      </div>
    </div>
  {:else}
    <Sheet
      {blocks}
      {nRows}
      {nCols}
      {store}
    />
  {/if}
{/if}
