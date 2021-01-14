<script>
  export let label;
  export let placeholder;
  export let id;
  export let type;
  export let error;
  export let classes = "mt-8"
  export let value = "";
  export let required = true;
</script>

<div class="relative w-full mb-3 {classes}">
  <label
    class="block uppercase text-xs font-bold mb-2"
    class:text-gray-700={!error}
    class:text-red-700={error}
    class:error
    for={id}
    >{label}{required ? "*" : ""}{error ? " " + error : ""}</label>
  <input
    on:change
    {value}
    on:input={() => error = ""}
    {id}
    {required}
    {type}
    class:ring-blue-200={!error}
    class:ring-red-200={error}
    class:ring-0={!error}
    class:ring-1={error}
    class="focus:ring-2 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
    placeholder={placeholder}
  />
</div>
