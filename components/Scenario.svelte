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
    renameScenario,
  } from "/utils/actions/scenarios.js";
  import { getScenarioMenuItems } from "/utils/menus.js";

  const { scenarios } = require("/index.ellx")

  export let id;
  export let title;

  function withEmpty(opts) {
    if (typeof opts === "function") opts = opts();
    if (!opts || !opts.length) return [];

    return [["", "選択してください"], ...opts];
  }
</script>

<div
  style="top: 0; min-width: 0; min-height: 0"
  class="round sticky border dark:border-gray-700 dark:bg-gray-800 bg-white z-20 relative"
>
  <div
    class="flex flex-row justify-between px-2 items-center bg-gray-600 dark:bg-gray-900 relative w-full h-full"
  >
    <Cell
      class="text-left text-gray-100 text-sm font-medium"
      value={title}
      on:change={({ detail }) => renameScenario({ id, detail })}
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
  {#each rowTypes as { id: key, format, calculate, options }, i}
    <Cell
      value={getTypeValue({
        rowType: { id: key, calculate },
        data: $scenarios.get(id).data,
      })}
      editable={!calculate}
      options={withEmpty(options)}
      on:change={({ detail, target }) => updateCell(id, { value: detail || target.value, key })}
      class={cn({
        "border-y truncate p-1 h-6 items-center text-xs text-right font-medium": true,
        "mt-2": i !== 0,
      })}
    >
      {formatValue(
        format,
        getTypeValue({
          rowType: { id: key, calculate },
          data: $scenarios.get(id).data,
        })
      )}
    </Cell>
  {/each}
</div>
