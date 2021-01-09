<script>
  export let label;
  export let placeholder;
  export let id;
  export let value;
</script>

<div class="relative w-full mb-3 mt-8">
  <label
    class="block uppercase text-gray-700 text-xs font-bold mb-2"
    for={id}
    >{label}</label
  ><input
    bind:value
    required
    {id}
    type="text"
    class="focus:ring-2 ring-blue-200 ring-0 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
    placeholder={placeholder}
  />
</div>
