<script context="module">
  import { tick } from "svelte";
  import { writable } from "svelte/store";

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


  let node;
  const activeId = writable();

  export async function onClickActivator({ pageX, pageY }) {
    await tick();
    if (!node) return;

    if (window.innerWidth - pageX - node.clientWidth < 0) {
      node.style.left = `${pageX - node.clientWidth}px`
    } else {
      node.style.left = `${pageX}px`
    }

    if (window.innerHeight - pageY - node.clientHeight < 0) {
      node.style.top = `${pageY - node.clientHeight}px`
    } else {
      node.style.top = `${pageY}px`
    }
  }
</script>

<script>
  import { uid } from '/utils.js';

  export let open = false;

  let id = uid();

  $: if (open) {
    $activeId = id;
  } else {
    $activeId = false;
  }
</script>

<div
  use:clickedOutside={() => open = false}
  class="{$$props.class || ''} cursor-pointer relative"
  on:click|stopPropagation
>
  <span on:click={(e) => {
    open = !open;
    onClickActivator(e);
  }}>
    <slot name="activator" />
  </span>
  {#if $activeId === id}
    <div
      bind:this={node}
      on:click={() => open = false}
      class="shadow text-xs fixed w-auto bg-white dark:bg-gray-800 z-50"
    >
      <slot />
    </div>
  {/if}
</div>
