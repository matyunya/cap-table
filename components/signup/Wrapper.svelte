<script>
  import _ from "/utils/intl.js";
  export let title = "Capital Dash";
</script>

<div
  class="w-full h-full min-h-screen flex items-center justify-center z-20 text-black dark:text-white"
>
  <div
    class="transition duration-200 w-96 z-20 border rounded shadow-lg py-12 break-words px-8 mb-6 antialiased dark:bg-gray-700 bg-blue-gray-100"
  >
    {#if title}
      <h1 class="text-center text-3xl font-bold tracking-wide mb-8">
        {$_(title)}
      </h1>
    {/if}
    <slot />
  </div>
</div>
