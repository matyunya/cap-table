<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import Scenario from "/components/Scenario.svelte";
  import _ from "/utils/intl.js";
  import { rowTypes } from "/utils/actions/scenarios.js";
  import Benchmarks from "/components/Benchmarks.svelte";

  const { itemIds, sheetStatus } = require("/index.ellx");
</script>

<section class="relative text-sm flex flex-col max-w-5xl mx-auto mt-12">
  <div class="flex justify-start items-center space-x-6">
    <h2 class="font-bold text-lg mt-6 text-left tracking-wide">
      {$_("株価算定（類似業種批准方式）")}
    </h2>
  </div>
</section>

{#if $sheetStatus === "success"}
  <div class="m-12">
    <div
      class="calc relative grid grid-flow-col grid-cols-1 gap-2 grid-rows-2 cap-table text-xs text-gray-700 dark:text-gray-200 mt-6 bg-blurred z-40"
      on:click={setEditing}
    >
      <div style="top: 0; left: 0;" />
      <div
        style="left: 0;"
        class="col-start-1 row-start-2 flex flex-1 flex-col border dark:border-gray-700 bg-white dark:bg-gray-800 p-1"
      >
        {#each rowTypes as { label }, i}
          <Cell
            editable={false}
            class="cell p-1 h-6 items-center text-left font-bold {i !== 0 ? "mt-2" : ""}"
          >
            {label}
          </Cell>
        {/each}
      </div>
      {#each $itemIds as [id, title]}
        <Scenario {id} {title} />
      {/each}
    </div>
  </div>
{/if}

<Benchmarks />

<style>
  .calc {
    grid-template-rows: 2rem 1fr;
    /* investor col width */
    grid-template-columns: 200px;
    grid-auto-columns: minmax(auto, 200px);
    width: auto;
  }

  :global(.cell:hover .icon) {
    opacity: 1;
  }
  :global(.cell .icon) {
    opacity: 0;
  }
</style>
