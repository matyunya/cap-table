<script>
  import headlong from "~matyunya/headlong";
  import { onMount, tick } from "svelte";
  import HomePage from "./HomePage.svelte";
  import Sheet from "./Sheet.svelte";

  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let store;

  let page = "home";
//   Uncomment to jump straight to the table
  page = "cap-table";

  function onRegistered() {
    page = "cap-table";
  }

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
  <HomePage on:success={onRegistered} />
{:else}
  <Sheet
    {blocks}
    {nRows}
    {nCols}
    {store}
  />
{/if}
