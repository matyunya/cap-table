<script>
  import Cell from "/components/sheet/Cell.svelte";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import Icon from "/components/ui/Icon.svelte";
  import _ from "/utils/intl.js";
  import cn from "/utils/cn.js";
  import {
    rowTypes,
    updateCell,
    getTypeValue,
    formatValue,
  } from "/utils/actions/scenarios.js";
  import { getScenarioMenuItems } from "/utils/menus.js";

  export let id;
  export let title;
</script>

<div
  style="top: 0; min-width: 0; min-height: 0"
  class="round sticky border dark:border-gray-700 dark:bg-gray-800 bg-white z-20 relative"
>
  <div
    class="flex flex-row justify-between px-2 items-center bg-gray-600 dark:bg-gray-900 relative w-full h-full"
  >
    <Cell
      editable={false}
      class="text-left text-gray-100 text-sm font-medium"
      value={title}
    />
    <Icon
      class="text-white bg-gray-800"
      on:click={(e) => openContextMenu(getScenarioMenuItems({ id }), e)}
      size="20"
    />
  </div>
</div>

<div
  style="min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-1 rounded-sm flex flex-col"
>
  {#each rowTypes as { id, format, calculate }, i}
    <Cell
      value={getTypeValue({
        rowType: { id, calculate },
        data: {},
      })}
      editable={!calculate}
      on:change={({ detail }) => updateCell({ value: detail, id })}
      class={cn({
        "border-y truncate p-1 h-6 items-center text-xs text-right font-medium": true,
        "mt-2": i !== 0,
      })}
    >
      {formatValue(
        format,
        getTypeValue({
          rowType: { id, calculate },
          data: {},
        })
      )}
    </Cell>
  {/each}
</div>
