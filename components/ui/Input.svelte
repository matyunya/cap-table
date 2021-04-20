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
</script>

<div class="relative w-full mb-3 {classes}">
  <Label {id} {required} {error} {label} />
  <input
    on:change
    {value}
    on:input={() => (error = "")}
    {id}
    {required}
    {type}
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

  :global(input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus) {
    border: inherit;
    -webkit-text-fill-color: inherit;
    -webkit-box-shadow: inherit;
    box-shadow: inherit;
    transition: background-color 5000s ease-in-out 0s;
  }
</style>
