<script>
  export let rotate = 0;
  export let size = 16;
  export let absolute = true;
  export let wrapperClasses = "top-0 right-0 h-full flex items-center pr-1";
  export let dark = false;
</script>

<div style={$$props.style || ""} on:click class:absolute class={wrapperClasses}>
  <svg
    class:text-white={dark}
    class:bg-gray-800={dark}
    class:bg-gray-300={!dark}
    class="{$$props.class ||
      ""} rounded-full shadow-lg hover:shadow-xl dark:bg-light-blue-100  hover:bg-gray-200 dark:bg-light-blue-900  hover:text-black hover:dark:text-gray-100 hover:dark:bg-light-blue-700 transition duration-200 cursor-pointer icon z-40"
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
