<script context="module">
  import Cell from "/components/sheet/Cell.svelte";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import Icon from "/components/ui/Icon.svelte";

  export const ROUND_WIDTHS = {
    founded: 200,
    common: 600,
    split: 600,
    "j-kiss": 300,
  };

  export const INVESTORS_COL_WIDTH = 200;
  export const calculateWidth = (rs) => {
    return rs instanceof Map
      ? [...rs.values()].reduce(
          (acc, { type }) => acc + ROUND_WIDTHS[type],
          INVESTORS_COL_WIDTH
        )
      : 0;
  };
</script>

<script>
  import TableData from "/components/sheet/TableData.svelte";
  import RoundResults from "/components/sheet/RoundResults.svelte";
  import RoundControls from "/components/sheet/RoundControls.svelte";
  import {
    roundOptions,
    renameRound,
    updateRoundDate,
  } from "/utils/actions/docs.js";
  import { roundMenuItems } from "/utils/menus.js";
  import _ from "/utils/intl.js";
  const { isAnon, investorGroups } = require("/index.ellx");

  export let type;
  export let name;
  export let date;
  export let splitBy;
  export let valuationCap;
  export let discount;
  export let id;
  export let result;

  $: width = ROUND_WIDTHS[type];
  $: options = roundOptions[type];

  let dateUpdateError;
</script>

<div
  style="top: 0; width: {width}px; min-width: 0; min-height: 0"
  class="round sticky border dark:border-gray-700 dark:bg-gray-800 bg-white grid grid-rows-2 z-20 relative"
>
  <div
    class="flex flex-row justify-between px-2 items-center bg-gray-600 dark:bg-gray-900 relative"
  >
    <Cell
      class="text-left text-gray-100 text-sm font-medium"
      on:change={({ detail }) => renameRound({ roundId: id, value: detail })}
      value={name}
    />
    <Cell
      class="text-right text-gray-100 text-xs mr-6"
      error={dateUpdateError}
      value={date || "未設定"}
      on:change={({ detail }) => {
        try {
          updateRoundDate({ roundId: id, value: detail });
        } catch (e) {
          dateUpdateError = e;
        }
      }}
    />
    {#if !$isAnon}
      <Icon
        class="text-white bg-gray-800"
        on:click={(e) => openContextMenu(roundMenuItems(id), e)}
        size="20"
      />
    {/if}
  </div>
  <div
    class="flex flex-row justify-evenly text-center text-xs items-center font-medium px-1"
  >
    {#each Object.keys(options.cols) as colType}
      <div class="flex-1 h-full p-1 flex items-center justify-end truncate">
        {$_(options.cols[colType].label)}
      </div>
    {/each}
  </div>
</div>

<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-1 rounded-sm gap-0 grid grid-cols-{Object.keys(
    options.cols
  ).length}"
>
  <TableData
    groups={$investorGroups}
    roundId={id}
    readOnly={type === "split"}
    cols={options.cols}
    values={result.values}
  />
</div>

<RoundControls {result} {splitBy} {valuationCap} {discount} {id} {type} />

<RoundResults {result} {width} {id} {type} />
