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
    getProjectValue,
  } from "/utils/actions/plans.js";
  import { getYearMenuItems } from "/utils/menus.js";

  const { profile, data, ipo, fundingAmount } = require("/index.ellx");

  export let year;
  export let i;
  export let projects;

  function ipoDisplayValue(val) {
    if (year === val) {
      return "IPO";
    }
    if (year > val) {
      return `N+${year - val}`;
    }
    if (year < val) {
      return `N-${val - year}`;
    }
  }
</script>

{#if $data instanceof Map}
  <div
    style="top: 0; min-width: 0; min-height: 0"
    class="round sticky border dark:border-gray-700 dark:bg-gray-800 bg-white grid grid-rows-3 z-20 relative"
  >
    <div
      class="flex flex-row justify-between px-2 items-center bg-gray-600 dark:bg-gray-900 relative"
    >
      <Cell
        editable={false}
        class="text-left text-gray-100 text-sm font-medium"
        value={i === 0 ? "実績" : "計画"}
      />
      {#if i !== 0}
        <Icon
          class="text-white bg-gray-800"
          on:click={(e) => openContextMenu(getYearMenuItems({ year }), e)}
          size="20"
        />
      {/if}
    </div>
    <div
      class="w-full flex justify-center text-xs items-center font-medium px-1 space-x-4"
    >
      <div>{i === 0 ? "直近期末" : i + "年後"}</div>
      {#if $ipo && i !== 0}
        <div>{ipoDisplayValue($ipo)}</div>
      {/if}
    </div>
    <div
      class="w-full flex justify-center text-xs items-center font-medium px-1"
    >
      {year}年{$profile.settlementMonth || 3}月期
    </div>
  </div>

  <div
    style="min-width: 0; min-height: 0;"
    class="border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-1 rounded-sm flex flex-col"
  >
    {#each rowTypes as { id, hasProjects, format, calculate }, i}
      <Cell
        value={getTypeValue({
          rowType: { id, hasProjects, calculate },
          year,
          data: $data,
          fundingAmount: $fundingAmount
        })}
        editable={!hasProjects && !calculate}
        on:change={({ detail }) => updateCell({ year, value: detail, id })}
        class={cn({
          "border-y truncate p-1 h-6 items-center text-xs text-right font-medium": true,
          "mt-6": i !== 0 && hasProjects,
          "mt-2": i !== 0 && !hasProjects,
        })}
      >
        {formatValue(
          format,
          getTypeValue({
            rowType: { id, hasProjects, calculate },
            year,
            data: $data,
            fundingAmount: $fundingAmount
          })
        )}
      </Cell>
      {#if hasProjects}
        {#each [...$projects.keys()] as projectId}
          <Cell
            class="border-y truncate p-1 h-6 items-center text-xs text-right font-medium"
            value={getProjectValue(id, year, $data, projectId)}
            on:change={({ detail }) =>
              updateCell({ year, value: detail, id, projectId })}
          >
            {formatValue(format, getProjectValue(id, year, $data, projectId))}
          </Cell>
        {/each}
      {/if}
    {/each}
  </div>
{/if}
