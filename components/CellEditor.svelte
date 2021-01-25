<script>
  import { onMount } from "svelte";
  export let value;
  export let id;
  export let save;
  export let type;

  let node;

  onMount(() => {
    node.focus();
    node.select();
  });

  function clickedOutside(node, cb) {
    const onclick = e => !node.contains(e.target) && cb();

    window.addEventListener('mousedown', onclick, true);

    return {
      update(newCb) {
        cb = newCb;
      },
      destroy() {
        window.removeEventListener('mousedown', onclick, true);
      }
    };
  }

</script>

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
  use:clickedOutside={save}
  {id}
  tabindex="-1"
  class="grid__editor"
  bind:value
  on:input
  on:keydown
  rows="1"
  autocomplete="off"
  autocorrect="off"
  spellcheck="false"
  bind:this={node}
/>
