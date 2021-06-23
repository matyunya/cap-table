<script>
  import _ from "/utils/intl.js";
  import { withEmpty } from "/utils/selectors.js";
  import Label from "/components/ui/Label.svelte";
  export let label;
  export let placeholder;
  export let id;
  export let error;
  export let options = [];
  export let value;
  export let hasEmpty = true;
  export let required = false;
  export let classes =
    "focus:ring-2 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded-xl text-sm shadow focus:outline-none focus:shadow-outline w-full";

  $: optionsWithEmpty = hasEmpty ? withEmpty(options) : options;
</script>

{#if label}
  <Label class="mb-2 mt-4" {id} {required} {error} {label} />
{/if}
<select
  {value}
  on:change
  {id}
  class:ring-light-blue-200={!error}
  class:ring-red-200={error}
  class:ring-0={!error}
  class:ring-1={error}
  class:dark:text-gray-200={!error}
  class="dark:bg-gray-800 pr-4 {classes}"
  placeholder={$_(placeholder)}
>
  {#each optionsWithEmpty as [val, text]}
    <option value={val}>
      {$_(text)}
    </option>
  {/each}
</select>
