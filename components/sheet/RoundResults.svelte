<script>
  import Cell from "/components/sheet/Cell.svelte";
  import { updateSharePrice } from "/utils/actions/docs.js";
  import { format } from "/utils/index.js";

  export let result;
  export let width;
  export let id;
  export let type;
</script>

<div
  style="width: {width}px; min-width: 0; min-height: 0;"
  class="border dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 text-center p-1"
>
  {#if result && result.roundResults}
    <Cell
      editable={type !== "j-kiss" && type !== "split"}
      class="p-1 h-6 items-center"
      value={result.roundResults.sharePrice}
      on:change={({ detail }) =>
        updateSharePrice({ roundId: id, value: detail })}
    >
      {format.currency.format(result.roundResults.sharePrice)}
    </Cell>
    <div class="p-1 h-6 items-center truncate">
      {format.currency.format(result.roundResults.newEquity)}
    </div>
    <div class="p-1 h-6 items-center truncate">
      {format.currency.format(result.roundResults.preMoney)}
    </div>
    <div class="p-1 h-6 items-center truncate">
      {format.currency.format(result.roundResults.postMoney)}
    </div>
    <div class="p-1 h-6 items-center truncate">
      {format.currency.format(result.roundResults.preMoneyDiluted)}
    </div>
    <div class="p-1 h-6 items-center truncate">
      {format.currency.format(result.roundResults.postMoneyDiluted)}
    </div>
  {/if}
</div>
