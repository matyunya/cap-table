<script>
  import _ from "/utils/intl.js";
  export let title;
  import Spinner from "/components/ui/Spinner.svelte";
  const { authStatus } = require("/index.ellx");

  export let loading = false;
  export let success = false;
</script>

<div
  class="flex items-center justify-center z-20 text-black dark:text-white mt-20"
>
  <div
    class="transition duration-200 z-20 border rounded shadow-lg py-12 break-words px-8 mb-6 antialiased dark:bg-gray-700 bg-blue-gray-100"
    style="width: 36em"
  >
    {#if title}
      <h1 class="text-center text-3xl font-bold tracking-wide mb-8">
        {$_(title)}
      </h1>
    {/if}
    {#if success}
      <slot name="success">
        <div
          class="flex items-center justify-center text-green-500 font-medium text-lg tracking-wide font-mono"
        >
          {$_("成功しました")}
        </div>
      </slot>
      <a href="/" class="button w-full mt-12 block">
        {$_("topへ戻る")}
      </a>
    {:else if $authStatus === "stale" || loading}
      <div class="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    {:else}
      <slot />
    {/if}
  </div>
</div>
