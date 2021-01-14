<script>
  import headlong from "~matyunya/headlong";
  import { tick, onMount } from "svelte";
  import ContextMenu, { openContextMenu } from "./ContextMenu.svelte";
  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let rowHeight = 20;
  export let columnWidth = 70;
  export let store;

  let editing = false;
  let onSave = false;

  $: tiles = [...blocks].reduce((acc, [id, {
    position: [firstRow, firstCol, lastRow, lastCol],
    value, classes, onChange, menuItems, format = i => i
  }]) => {
    return [
      ...acc,
      { id, pos: [firstRow, firstCol, lastRow - firstRow + 1, lastCol - firstCol + 1],
       value, classes, onChange, format, menuItems,
      }
    ]
  }, []);

  onMount(async () => {
    await tick();

    const h = headlong();

    return () => {
      h.unsubscribe();
    }
  });

  function setEditing(onChange, id) {
    if (editing) save();

    if (!onChange) return;

    editing = id;
    onSave = onChange;

    tick().then(() => {
      const el = document.getElementById(editing);
      if (el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    })
  }

  const getValue = el => [].reduce.call(el.childNodes, (a, b) => a + (b.nodeType === 3 ? b.textContent : ''), '').trim();

  function save() {
    const el = document.getElementById(editing);
    if (!el) return;

    const value = getValue(el);

    onSave(store, {
      value,
      id: editing,
    });

    editing = false;
  }

  function onKeydown(e) {
    if (!editing) return;

    if (['Enter', 'Escape'].includes(e.code)) {
      e.preventDefault();
    } else {
      return;
    }

    if (e.code === 'Enter') {
      save();
    }
    if (e.code === 'Escape') {
      editing = false;
      blocks = blocks;
    }
  }

  function checkClickedOutside(e) {
    if (!editing) return;

    const node = document.getElementById(editing);
    if (node && !node.parentNode.contains(e.target)) {
      save();
    }
  }
</script>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }

  .tile {
    line-height: 16px;
    padding: 2px 4px;
  }

  .w-block {
    box-shadow: 0 0 0 0.5px rgb(239,239,239) inset;
  }

  :global(.mode-dark) .w-block {
    box-shadow: 0 0 0 0.5px rgb(50,50,50) inset;
  }

  .editable:hover {
    box-shadow: 0 0 0 0.5px rgb(150,150,220) inset;
  }

  .w-block:hover .toggle {
    opacity: 1;
  }
  .toggle {
    margin-top: 2px;
  }
</style>

<svelte:window on:click={checkClickedOutside} />

<ContextMenu />

<div class="md:m-12 m-6 mt-12 gridlayout__container gridlines shadow rounded bg-white dark:bg-gray-800" style={`width: ${(nCols + 1) * columnWidth}px; height: ${nRows * rowHeight}px;`}>
  {#each tiles as {id, pos: [row, col, rowSpan, colSpan], value, classes, onChange, format, menuItems } (id)}
    <div
      class:editable={onChange}
      on:keydown|stopPropagation={onKeydown}
      on:click={() => setEditing(onChange, id)}
      class:border={editing === id}
      class:menuItems
      class="w-block tile absolute overflow-hidden dark:bg-dark-700 dark:text-white border-blue-500 border-1 {classes || ""}"
      style={`
        transform: translate(${col * columnWidth}px, ${row * rowHeight}px);
        height: ${rowSpan * rowHeight}px;
        width: ${(colSpan || 1) * columnWidth}px;
      `}
    >
      {#if menuItems && editing !== id}
        <div
          on:click|stopPropagation={(e) => openContextMenu(menuItems(store, { id }), e)}
          class="flex text-center items-center shadow-sm bg-white dark:bg-gray-600 justify-center toggle absolute top-0 opacity-0 transition duration-150 right-0 rounded-full p-1 text-blue-500 hover:bg-blue-500 hover:text-white h-4 w-4 mr-2 cursor-pointer select-none font-normal">+</div>
      {/if}
      {#if row === 0 && col === 0}
        <svg title="Made with Ellx" class="rounded-full p-1 hover:bg-blue-gray-200 transition duration-500 transform cursor-pointer hover:rotate-360" width="24px" height="24px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><g><ellipse ry="40" rx="40" id="dot_1" cy="110" cx="200"></ellipse><ellipse ry="40" rx="40" id="dot_2" cy="250" cx="100"></ellipse><ellipse ry="40" rx="40" id="dot_3" cy="250" cx="300"></ellipse></g></svg>
      {:else}
        <span
          class="w-full h-full"
          contenteditable={editing === id}
          {id}
        >
          {editing === id ? value : format(value)}
        </span>
      {/if}
    </div>
  {/each}
</div>
