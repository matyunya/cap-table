<script>
  import Label from "/components/ui/Label.svelte";
  export let label;
  export let placeholder;
  export let id;
  export let type;
  export let error;
  export let classes = "mt-4";
  export let value = "";
  export let required = true;
  export let max;
</script>

<div class="relative w-full mb-3 {classes}">
  {#if label}
    <Label {id} {required} {error} {label} />
  {/if}
  <input
    on:change
    on:input
    {value}
    on:input={() => (error = "")}
    {id}
    {required}
    {type}
    {max}
    class:error
    class:ring-light-blue-200={!error}
    class:ring-red-200={error}
    class:ring-0={!error}
    class:ring-1={error}
    class="focus:ring-2 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
    {placeholder}
  />
</div>

<style>
  :global(.mode-dark) ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

  :global(input::-webkit-outer-spin-button, input::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  :global(input[type="number"]) {
    -moz-appearance: textfield;
  }
</style>
