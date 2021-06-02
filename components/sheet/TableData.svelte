<script>
  import Cell from "./Cell.svelte";
  import cn from "/utils/cn.js";
  import { format } from "/utils/index.js";

  export let values;
  export let groups;
  export let readOnly = false;
  export let cols;
  export let roundId;
</script>

{#each groups as { isGroup, id }, i}
  {#each Object.keys(cols) as colType}
    <Cell
      value={values[colType].get(id)}
      editable={!isGroup &&
        !readOnly &&
        typeof cols[colType].onChange === "function"}
      on:change={({ detail }) =>
        cols[colType].onChange({ investorId: id, value: detail, roundId })}
      class={cn({
        "border-y truncate p-1 h-6 items-center text-xs text-right": true,
        "font-medium": isGroup,
        "mt-4 border-t dark:border-gray-600": isGroup && i !== 0,
      })}
    >
      {format[cols[colType].format].format(values[colType].get(id))}
    </Cell>
  {/each}
{/each}

{#each Object.keys(cols) as colType}
  <div
    class="border-y p-1 pt-3 truncate items-center text-xs text-right font-bold mt-4 border-t dark:border-gray-600"
  >
    {format[cols[colType].format].format(values[colType].get("total"))}
  </div>
{/each}
