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

  export async function onClickActivator({ pageX, pageY, ...params }) {
    await tick();
    if (!node) return;

    if (window.innerWidth - pageX - node.clientWidth < 0) {
      node.style.left = `${pageX - node.clientWidth - window.scrollX}px`
    } else {
      node.style.left = `${pageX - window.scrollX}px`
    }

    if (window.innerHeight - pageY - node.clientHeight < 0) {
      node.style.top = `${pageY - node.clientHeight - window.scrollY}px`
    } else {
      node.style.top = `${pageY - window.scrollY}px`
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

  function onKeydown(e) {
    if (e.code === 'Escape') {
      open = false;
    }
  }

  $: if ($activeId && $activeId === id) console.log({ open, $activeId, id, node });
</script>

<svelte:window on:keydown={onKeydown} />

<div
  use:clickedOutside={() => open = false}
  class="{$$props.class || ''} cursor-pointer relative z-50"
  on:click|stopPropagation
>
  <span on:click={(e) => {
    open = !open;
    onClickActivator(e);
  }}>
    <slot name="activator" />
  </span>
  <div
    bind:this={node}
    on:click={() => open = false}
    class:hidden={$activeId !== id}
    class="shadow text-xs fixed w-auto bg-white dark:bg-gray-800 z-50"
  >
    <slot />
  </div>
</div>
