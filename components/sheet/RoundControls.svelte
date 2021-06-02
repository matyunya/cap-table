<script>
  import _ from "/utils/intl.js";
  import Cell from "/components/sheet/Cell.svelte";
  import { format } from "/utils/index.js";
  import {
    updateSplitBy,
    updateValuationCap,
    updateDiscount,
  } from "/utils/actions/docs.js";

  export let result;
  export let id;
  export let type;
  export let splitBy;
  export let valuationCap;
  export let discount;
</script>

<div class="py-4 flex items-center flex-row flex-wrap" style="height: 6rem">
  {#if type === "split"}
    <div
      class:font-bold={result && !result.isCapApplied}
      class="w-1/2 flex items-center justify-end px-4"
    >
      {$_("分割数")}
    </div>
    <Cell
      id="split-by:{id}"
      class="flex-1 h-8 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono text-sm"
      value={splitBy}
      on:change={({ detail }) => updateSplitBy({ roundId: id, value: detail })}
    />
  {:else if type === "j-kiss"}
    <div
      class:font-bold={result && result.isCapApplied}
      class="w-1/2 flex items-center justify-end px-4"
      style="font-size: 0.8rem"
    >
      {$_("ﾊﾞﾘｭｴｰｼｮﾝｷｬｯﾌﾟ")}
    </div>
    <Cell
      id="valuation:{id}"
      class="w-1/2 flex-1 h-6 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono"
      value={valuationCap}
      on:change={({ detail }) =>
        updateValuationCap({ roundId: id, value: detail })}
      >{format.currency.format(valuationCap)}</Cell
    >
    <div
      class="w-1/2 flex items-center justify-end px-4"
      style="font-size: 0.8rem"
    >
      {$_("割引率")}
    </div>
    <Cell
      class="w-1/2 flex-1 h-6 text-center border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono"
      value={discount}
      on:change={({ detail }) => updateDiscount({ roundId: id, value: detail })}
    >
      {discount}%
    </Cell>
  {/if}
</div>
