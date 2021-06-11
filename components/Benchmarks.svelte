<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import _ from "/utils/intl.js";
  import { withEmpty } from "/utils/selectors.js";
  import { updateCell, createBenchmark } from "/utils/actions/benchmarks.js";

  const { benchmarkIds, benchmarks } = require("/index.ellx");

  const BENCHMARK_LABELS = [
    "区分",
    "企業名",
    "証券コード",
    "PSR",
    "PER",
    "時価総額",
    "データ基準日",
    "類似企業として選択した理由など",
  ];

  const CATEGORIES_OPTIONS = [
    "東証1部",
    "東証2部",
    "JQ",
    "マザーズ",
    "海外",
    "その他",
  ].map((i) => [i, i]);

  const update =
    (id, key) =>
    ({ detail }) =>
      updateCell(id, { key, value: detail });
</script>

<section class="relative text-sm flex flex-col max-w-5xl mx-auto mt-12">
  <div class="flex justify-start items-center space-x-6">
    <h2 class="font-bold text-lg mt-6 text-left tracking-wide">
      {$_("上場しているベンチマーク企業（類似企業）")}
    </h2>
  </div>
</section>

{#if $benchmarks instanceof Map && Array.isArray($benchmarkIds)}
  <div class="max-w-5xl mx-auto">
    <div
      class="relative benchmark grid gap-y-2 bg-white dark:bg-gray-800 shadow-lg grid-cols-8 grid-flow-row cap-table text-xs text-gray-700 dark:text-gray-200 mt-6 bg-blurred z-40"
      on:click={setEditing}
    >
      {#each BENCHMARK_LABELS as label}
        <div
          class="flex items-center justify-center px-2 text-xs bg-gray-600 dark:bg-gray-900 relative text-gray-100 font-medium"
        >
          {label}
        </div>
      {/each}
      {#each $benchmarkIds as [id]}
        <Cell
          value={$benchmarks.get(id).data.get("category")}
          on:change={update(id, "category")}
          options={withEmpty(CATEGORIES_OPTIONS)}
          class="p-1 h-6 items-center text-left font-bold"
        />
        <Cell
          value={$benchmarks.get(id).data.get("title")}
          on:change={update(id, "title")}
          placeholder="企業名を入力"
          class="p-1 h-6 items-center text-left"
        />
        <Cell
          value={$benchmarks.get(id).data.get("code")}
          on:change={update(id, "code")}
          placeholder="0000"
          class="p-1 h-6 items-center text-center"
        />
        <Cell
          value={$benchmarks.get(id).data.get("psr")}
          on:change={update(id, "psr")}
          placeholder="00"
          class="p-1 h-6 items-center text-center"
        />
        <Cell
          value={$benchmarks.get(id).data.get("per")}
          on:change={update(id, "per")}
          placeholder="00"
          class="p-1 h-6 items-center text-center"
        />
        <Cell
          value={$benchmarks.get(id).data.get("marketCap")}
          on:change={update(id, "marketCap")}
          placeholder="0億円"
          class="p-1 h-6 items-center text-right"
        />
        <Cell
          value={$benchmarks.get(id).data.get("foundedDate")}
          on:change={update(id, "foundedDate")}
          placeholder="YYYY/MM/DD"
          class="p-1 h-6 items-center text-center"
        />
        <Cell
          value={$benchmarks.get(id).data.get("comment")}
          on:change={update(id, "comment")}
          placeholder="テキストを入力"
          class="p-1 h-6 items-center text-left"
        />
      {/each}
    </div>
    <button class="button mt-4" on:click={createBenchmark}>企業を追加</button>
  </div>
{/if}

<style>
  .benchmark {
    grid-template-rows: 2rem 1fr;
    grid-template-columns:
      8rem minmax(150px, 1fr) repeat(3, 5rem) repeat(2, minmax(100px, auto))
      minmax(250px, 1fr);
  }
</style>
