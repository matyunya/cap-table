<script>
  import { tick, onMount } from "svelte";
  import headlong from "~matyunya/headlong";
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
    value, classes, onChange, format = i => i
  }]) => {
    return [
      ...acc,
      { id, pos: [firstRow, firstCol, lastRow - firstRow + 1, lastCol - firstCol + 1], value, classes, onChange, format }
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

      onSave(store, {
        value: document.getElementById('editing').innerText,
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

  .gridlayout__tile {
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
</style>

<svelte:window on:keydown={onKeydown} on:click={checkClickedOutside} />

<div class="gridlayout__container gridlines" style={`width: ${nCols * columnWidth}px; height: ${nRows * rowHeight}px;`}>
  {#each tiles as {id, pos: [row, col, rowSpan, colSpan], value, classes, onChange, format } (id)}
    <div
      class:editable={onChange}
      on:click={() => setEditing(onChange, id)}
      contenteditable={editing === id}
      class:border={editing === id}
      id={editing === id ? "editing": ""}
      class="w-block gridlayout__tile absolute overflow-hidden gridlayout__cell dark:bg-dark-700 dark:text-white border-blue-500 border-1 {classes || ""}"
      style={`
        transform: translate(${col * columnWidth}px, ${row * rowHeight}px);
        height: ${rowSpan * rowHeight}px;
        width: ${(colSpan || 1) * columnWidth}px;
      `}
    >
      {editing === id ? value : format(value)}
      {#if row === 0 && col === 0}
        <svg class="rounded-full p-1" width="24px" height="24px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><g><ellipse ry="40" rx="40" id="dot_1" cy="110" cx="200"></ellipse><ellipse ry="40" rx="40" id="dot_2" cy="250" cx="100"></ellipse><ellipse ry="40" rx="40" id="dot_3" cy="250" cx="300"></ellipse></g></svg>
      {/if}
    </div>
  {/each}
</div>
