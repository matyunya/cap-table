<script>
  import headlong from "~matyunya/headlong";
  import { tick, onMount } from "svelte";
  import ContextMenu, { openContextMenu } from "./ContextMenu.svelte";
  import _ from "./intl.js";
  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let rowHeight = 20;
  export let columnWidth = 80;
  export let store;

  let editing = false;
  let onSave = false;

  $: tiles = [...blocks].reduce((acc, [id, {
    position: [firstRow, firstCol, lastRow, lastCol],
    value, classes, onChange, menuItems, format = i => i, pinMenuToggle, isLabel, disabled
  }]) => {
    return [
      ...acc,
      { id, pos: [firstRow, firstCol, lastRow - firstRow + 1, lastCol - firstCol + 1],
       value, classes, onChange: disabled ? false : onChange, format, menuItems, pinMenuToggle, isLabel
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
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .w-block {
    box-shadow: 0 0 0 0.5px rgb(239,239,239) inset;
  }

  :global(.mode-dark) .w-block {
    box-shadow: 0 0 0 0.5px rgb(50,50,50) inset;
  }

  .editable:hover {
    box-shadow: 0 0 0 1.5px rgba(14,165,233,0.7) inset;
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

<div class="md:m-12 md:mr-24 dark:text-white text-black m-6 mt-12 gridlayout__container gridlines shadow rounded bg-white dark:bg-gray-800" style={`width: ${(nCols + 1) * columnWidth}px; height: ${nRows * rowHeight}px;`}>
  {#each tiles as {id, pos: [row, col, rowSpan, colSpan], value, classes, onChange, format, menuItems, pinMenuToggle, isLabel, disabled } (id)}
    <div
      class:editable={onChange}
      class:text-light-blue-700={onChange}
      class:dark:text-light-blue-300={onChange}
      on:keydown|stopPropagation={onKeydown}
      on:click={() => setEditing(onChange, id)}
      class:menuItems
      class:w-block={editing !== id}
      class:bg-light-blue-100={editing === id}
      class:bg-opacity-25={editing === id}
      class="tile px-1 absolute overflow-hidden dark:bg-dark-700 dark:text-white  {classes || ""}"
      style={`
        transform: translate(${col * columnWidth}px, ${row * rowHeight}px);
        height: ${rowSpan * rowHeight}px;
        width: ${(colSpan || 1) * columnWidth}px;
      `}
    >
      {#if menuItems}
        <div
          on:click|stopPropagation={(e) => openContextMenu(menuItems(store, { id }), e)}
          class:opacity-0={!pinMenuToggle}
          class="flex text-center items-center shadow-sm bg-white dark:bg-gray-600 justify-center toggle absolute top-0 transition duration-150 right-0 rounded-full p-1 text-light-blue-500 border-light-blue-300 hover:bg-light-blue-500 hover:text-white h-4 w-4 mr-2 cursor-pointer select-none font-normal">+</div>
      {/if}
      <span
        contenteditable={editing === id}
        {id}
      >
        {#if isLabel}
          {$_(value)}
        {:else}
          {editing === id ? value : format(value)}
        {/if}
      </span>
    </div>
  {/each}
</div>
