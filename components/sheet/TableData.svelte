<script>
  import Cell from "./Cell.svelte";
  const { investorGroups } = require("/index.ellx");

  export let values;
  export let readOnly = false;
  export let cols;

  $: console.log(cols);
</script>

{#each $investorGroups as { isGroup, id }, i}
  {#each Object.keys(cols) as colType}
    <Cell
      editable={!isGroup && !readOnly && typeof cols[colType].onChange === "function"}
      class="border-y p-1 h-6 items-center text-xs overflow-hidden text-right {isGroup
        ? 'font-medium'
        : ''} {isGroup && i !== 0 ? 'mt-4 border-t dark:border-gray-600' : ''}"
    >
      {cols[colType].format(values[colType].get(id))}
    </Cell>
  {/each}
{/each}

{#each Object.keys(cols) as colType}
  <div
    class="border-y p-1 pt-3 items-center text-xs overflow-hidden text-right font-bold mt-4 border-t dark:border-gray-600"
  >
    {cols[colType].format(values[colType].get("total"))}
  </div>
{/each}
