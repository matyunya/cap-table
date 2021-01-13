<script>
  export let label;
  export let placeholder;
  export let id;
  export let error;
  export let options = [];
  export let value;

  $: withEmpty = [["", "選択してください"], ...options];
</script>

<div class="relative w-full mb-3 mt-8">
  <label
    class="block uppercase text-xs font-bold mb-2"
    class:text-gray-700={!error}
    class:text-red-700={error}
    for={id}
    >{label}{error ? " " + error : ""}</label>
  <select
    {value}
    on:change
    {id}
    class:ring-blue-200={!error}
    class:ring-red-200={error}
    class:ring-0={!error}
    class:ring-1={error}
    class="focus:ring-2 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
    placeholder={placeholder}
  >
    {#each withEmpty as [val, text]}
      <option value={val}>
        {text}
      </option>
    {/each}
  </select>
</div>
