<script>
  import Cell, { setEditing } from "./Cell.svelte";
  import { onMount } from "svelte";
  import Round, { calculateWidth } from "./Round.svelte";
  import _ from "/utils/intl.js";

  let loading = true;

  onMount(async () => {
    try {
      await ellx.auth();
    } finally {
      loading = false;
    }
  });

  const { investorGroups, title, rounds, calculated } = require("/index.ellx");
</script>

<div
  class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800"
/>

{#if loading === false}
  <div
    style="width: {calculateWidth($rounds)}px"
    class="relative grid auto grid-cols-1 grid-rows-4 cap-table text-xs gap-x-2 m-8 mt-16 text-gray-700 dark:text-gray-200"
    on:click={setEditing}
  >
    <Cell
      style="top: 0; left: 0;"
      class="text-center sticky border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono text-sm shadow"
      value={$title}
    />
    <div
      style="left: 0;"
      class="col-start-1 row-start-2 sticky border dark:border-gray-700 flex flex-1 flex-col bg-white dark:bg-gray-800 shadow"
    >
      {#each $investorGroups as { id, label, isGroup }, i}
        <Cell
          class="p-1 h-6 items-center text-left {isGroup
            ? 'font-bold'
            : ''} {isGroup && i !== 0
            ? 'tracking-wide text-xs border-t dark:border-gray-600 mt-4'
            : ''}"
          {id}>{label}</Cell
        >
      {/each}
    </div>

    <!-- reserved for controls -->
    <div style="height: 4rem" class="col-start-1 row-start-3" />

    <div
      style="left: 0;"
      class="col-start-1 row-start-4 sticky p-1 border dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 shadow"
    >
      <!-- <div class="p-1 h-6 items-center">{$_("合計")}</div> goes up -->
      <div class="p-1 h-6 items-center">{$_("株価")}</div>
      <div class="p-1 h-6 items-center">{$_("調達金額")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Pre）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Post）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Pre/潜在込）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Post/潜在込）")}</div>
    </div>

    {#if $rounds && $rounds.values}
      {#each [...$rounds.keys()] as roundId (roundId)}
        <Round {...$rounds.get(roundId)} result={$calculated[roundId]} />
      {/each}
    {/if}
  </div>
{/if}

<style>
  .cap-table {
    grid-template-rows: 4rem 1fr;
    /* investor col width */
    grid-template-columns: 200px;
    grid-auto-columns: auto;
    width: auto;
  }

  .auto {
    grid-auto-flow: column;
  }
</style>
