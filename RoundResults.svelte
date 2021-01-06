<script>
  import { onMount, tick } from "svelte";
  import headlong from "~matyunya/headlong";
  export let sharePrice = 0;
  export let previousTotalShares = null;
  export let sharesEmitted = 0;

  $: preMoney = previousTotalShares ? sharePrice * previousTotalShares : null;

  const currency = new Intl.NumberFormat("ja-JA", {
    style: "currency",
    currency: "JPY",
  });

  onMount(async () => {
    await tick();
    const h = headlong();
    return () => h.unsubscribe();
  });
</script>

<div class="font-mono flex flex-col w-full max-w-sm my-4 p-2 bg-gray-100 ring-blue-gray-800 ring-1 hover:ring-2 transition duration-300 overflow-hidden">
  <div class="uppercase text-xs tracking-widest py-3">
     Round results
  </div>
  <div class="flex justify-between">
    <div class="text-gray-600 text-xs">Share price</div><div class="truncate">{ currency.format(sharePrice) }</div>
  </div>
  <div class="flex justify-between">
    <div class="text-gray-600 text-xs">New equity</div><div class="truncate">{ currency.format(sharePrice * sharesEmitted) }</div>
  </div>
  <div class="flex justify-between">
    <div class="text-gray-600 text-xs">Pre money</div><div class="truncate">{ preMoney ? currency.format(preMoney) : '-' }</div>
  </div>
  <div class="flex justify-between">
    <div class="text-gray-600 text-xs">Post money</div><div class="truncate">{ currency.format(preMoney + sharePrice * sharesEmitted) }</div>
  </div>
</div>
