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

  function clickedOutside(node, cb) {
    const onclick = e => !node.contains(e.target) && cb();

    window.addEventListener("mousedown", onclick, true);

    return {
      update(newCb) {
        cb = newCb;
      },
      destroy() {
        window.removeEventListener("mousedown", onclick, true);
      }
    };
  }

</script>

<style>
  .grid__editor {
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
  data-id={id}
  use:clickedOutside={save}
  {id}
  tabindex="-1"
  class="grid__editor {$$props.class || "flex items-center justify-center w-full"}"
  bind:value
  on:input
  on:keydown
  on:click|preventDefault
  rows="1"
  autocomplete="off"
  autocorrect="off"
  spellcheck="false"
  bind:this={node}
/>
