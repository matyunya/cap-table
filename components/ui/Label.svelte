<script>
  import _ from "/utils/intl.js";
  export let error;
  export let id;
  export let label;
  export let required = false;
</script>

<label
  class="block text-xs font-bold mb-2 {$$props.class}"
  class:dark:text-gray-100={!error}
  class:text-gray-700={!error}
  class:text-red-700={error}
  for={id}
>
  <slot>{$_(label)}{required ? "*" : ""}{error ? " " + $_(error) : ""}</slot>
</label>
