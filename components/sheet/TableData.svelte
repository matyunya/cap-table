<script>
  import Cell from "./Cell.svelte";
  import { format } from "/utils/index.js";

  const { investorGroups } = require("/index.ellx");
  export let size;
  export let values;

  console.log(values, 'VVVV');
</script>

{#each $investorGroups as { isGroup }, i}
  {#each [...new Array(size)] as _}
    <Cell
      editable={!isGroup}
      class="border-y p-1 h-6 items-center text-xs overflow-hidden text-right {isGroup
        ? 'font-medium'
        : ''} {isGroup && i !== 0
        ? 'mt-4 border-t dark:border-gray-600'
        : ''}"
      >{format.currency.format((Math.random() * 100000).toFixed(2))}</Cell
    >
  {/each}
{/each}
