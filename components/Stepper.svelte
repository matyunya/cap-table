<script>
  import _ from "/utils/intl.js";
  export let steps = ["ユーザー登録", "会社情報", "資金調達計画"];
  export let n = 0;
</script>

<div class="flex flex-row w-full justify-between max-w-sm mx-auto my-4">
  {#each steps as step, i}
    <div class="flex flex-col items-center">
      <div
        class:bg-light-blue-600={n >= (i + 1)}
        class:dark:bg-light-blue-800={n >= (i + 1)}
        class:ring-1={n >= (i + 1)}
        class:text-gray-100={n >= (i + 1)}
        class="rounded-full ring-light-blue-300 shadow-sm h-8 w-8 bg-gray-100 dark:bg-blue-gray-800 text-gray-500 flex items-center font-mono justify-center text-xs">{i + 1}</div>
      <div
        class:text-light-blue-700={n >= (i + 1)}
        class:dark:text-light-blue-200={n >= (i + 1)}
        class="text-center text-xs mt-3 font-medium text-gray-600 dark:text-gray-200">{$_(step)}</div>
    </div>
  {/each}
</div>
