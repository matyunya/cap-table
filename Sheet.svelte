<script>
  import { tick, onMount } from "svelte";
  import headlong from "~matyunya/headlong";
  import ContextMenu, { openContextMenu } from "./ContextMenu.svelte";
  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let rowHeight = 20;
  export let columnWidth = 70;
  export let tileSize = 10;
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

  function setEditing(onChange, id) {
    if (!onChange) return;

    editing = id;
    onSave = onChange;

    tick().then(() => {
      const el = document.getElementById('editing');
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

  function onKeydown(e) {
    if (!editing) return;

    if (e.code === 'Enter') {
      e.preventDefault();

      const el = document.getElementById('editing');
      if (!el) return;

      const value = [].reduce.call(el.childNodes, (a, b) => a + (b.nodeType === 3 ? b.textContent : ''), '').trim();

      onSave(store, {
        value,
        id: editing,
      });

      editing = false;
    }
    if (e.code === 'Escape') {
      e.preventDefault();
      editing = false;
      blocks = blocks;
    }
  }

  onMount(() => {
    setTimeout(() => headlong(), 50);
  });

  function checkClickedOutside(e) {
    if (!editing) return;

    const node = document.getElementById('editing');
    if (node && !node.contains(e.target)) {
      editing = false;
    }
  }
</script>

<style>
  .gridlayout__container {
    position: relative;
    font-family: monospace;
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

  .menuItems:hover .toggle {
    opacity: 1;
  }
  .toggle {
    margin-top: 2px;
  }
</style>

<svelte:window on:keydown={onKeydown} on:click={checkClickedOutside} />

<ContextMenu />

<div class="gridlayout__container gridlines shadow" style={`width: ${(nCols + 1) * columnWidth}px; height: ${nRows * rowHeight}px;`}>
  {#each tiles as {id, pos: [row, col, rowSpan, colSpan], value, classes, onChange, format, menuItems, onAddRight } (id)}
    <div
      class:editable={onChange}
      on:click={() => setEditing(onChange, id)}
      contenteditable={editing === id}
      class:border={editing === id}
      class:menuItems
      id={editing === id ? "editing": ""}
      class="w-block relative tile absolute overflow-hidden dark:bg-dark-700 dark:text-white border-blue-500 border-1 {classes || ""}"
      style={`
        transform: translate(${col * columnWidth}px, ${row * rowHeight}px);
        height: ${rowSpan * rowHeight}px;
        width: ${(colSpan || 1) * columnWidth}px;
      `}
    >
      {#if menuItems}
        <div
          contenteditable="false"
          on:click|stopPropagation={(e) => openContextMenu(menuItems(store, { id }), e)}
          class="flex text-center items-center justify-center toggle absolute top-0 opacity-0 transition duration-150 right-0 rounded-full p-1 text-blue-500 hover:bg-blue-200 hover:text-white h-4 w-4 mr-2 cursor-pointer select-none">+</div>
      {/if}
      {editing === id ? value : format(value)}
      {#if row === 0 && col === 0}
        <svg class="rounded-full p-1" width="24px" height="24px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><g><ellipse ry="40" rx="40" id="dot_1" cy="110" cx="200"></ellipse><ellipse ry="40" rx="40" id="dot_2" cy="250" cx="100"></ellipse><ellipse ry="40" rx="40" id="dot_3" cy="250" cx="300"></ellipse></g></svg>
      {/if}
    </div>
  {/each}
</div>
