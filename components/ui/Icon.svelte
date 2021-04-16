<script>
  export let rotate = 0;
  export let size = 16;
  export let absolute = true;
</script>

<div style={$$props.style || ""} on:click class:absolute class={$$props.class || "top-0 right-0 h-full flex items-center pr-1"}>
  <svg
    class="rounded-full hover:bg-light-blue-100 hover:text-gray-800 transition duration-150 cursor-pointer icon"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 16 16"
    style="transform: rotate({rotate}deg); padding: 0.2rem"
  >
    <path
      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
    />
  </svg>
</div>
