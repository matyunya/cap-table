<script>
  import { onMount } from "svelte";
  export let value;
  export let id;
  export let save;

  let node;

  onMount(() => {
    node.focus();
    node.select();
  });

  function checkClickedOutside(e) {
    if (node && !node.parentNode.contains(e.target)) {
//       save();
    }
  }
</script>

<svelte:window on:click={checkClickedOutside} />

<style>
  .grid__editor {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    outline: none;
    resize: none;
    white-space: nowrap;
    overflow: hidden;
    background: transparent;
  }
</style>


<textarea
  {id}
  tabindex="-1"
  class="grid__editor"
  bind:value
  on:input
  on:keydown
  autocomplete="off"
  autocorrect="off"
  spellcheck="false"
  bind:this={node}
/>
