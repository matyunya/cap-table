<script>
  import { tick } from "svelte";
  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let rowHeight = 20;
  export let columnWidth = 100;
  export let tileSize = 10;

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

  function replaceAll(input, regex, replacer) {
    let result = input;
    let match, delta = 0;

    while (match = regex.exec(input)) {
      const replacement = replacer(...match);
      result = result.slice(0, match.index + delta) + replacement + result.slice(regex.lastIndex + delta);
      delta += replacement.length - match[0].length;
    }

    return result;
  }

  function setEditing(onChange, id) {
    if (!onChange) return;

    editing = id;
    onSave = onChange;

    tick().then(() => {
      const el = document.getElementById('editing');
      if (el) el.focus();
    })
  }

  function onKeydown(e) {
    console.log({ e, editing });
    if (!editing) return;

    if (e.code === 'Enter') {
      e.preventDefault();
      onSave(document.getElementById('editing').innerText);
    }
    if (e.code === 'Escape') {
      e.preventDefault();
      editing = false;
    }
  }

  const URLS = /\[([^\[]+)\]\(([^)]*)\)/g;
  const parseLinks = cell => replaceAll(cell, URLS, (_, text, href) => `<a href="${href}">${text}</a>`);

  function checkClickedOutside(e) {
    if (!editing) return;

    const node = document.getElementById('editing');
    if (node && !node.contains(e.target)) {
      editing = false;
    }
  }
</script>

<style>
  .gridlines {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' fill='transparent' height='20'%3E%3Crect width='100' height='20' style='stroke-width:1;stroke:rgb(239,239,239)' /%3E%3C/svg%3E");
  }

  .gridlayout__container {
    position: relative;
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-family: monospace;
    color: black;
  }

  .gridlines :global(a) {
    color: blue;
  }

  .gridlayout__tile {
    position: absolute;
    line-height: 16px;
    white-space: nowrap;
    padding: 2px;
  }

  .bg-white {
    background: white;
    box-shadow: 0 0 0 0.5px rgb(239,239,239) inset;
  }

  :global(.mode-dark) .gridlines {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' fill='transparent' height='20'%3E%3Crect width='100' height='20' style='stroke-width:1;stroke:rgb(50,50,50)' /%3E%3C/svg%3E");
  }
</style>

<svelte:window on:keydown={onKeydown} on:click={checkClickedOutside} />

<div class="gridlayout__container gridlines" style={`width: ${nCols * columnWidth}px; height: ${nRows * rowHeight}px;`}>
  {#each tiles as {id, pos: [row, col, rowSpan, colSpan], value, classes, onChange, format } (id)}
    <div
      class:bg-white={rowSpan > 1 || colSpan > 1}
      class:cursor-pointer={onChange}
      on:click={() => setEditing(onChange, id)}
      contenteditable={editing === id}
      id={editing === id ? "editing": ""}
      class="gridlayout__tile gridlayout__cell dark:bg-gray-500 {classes || ""}"
      style={`
        transform: translate(${col * columnWidth}px, ${row * rowHeight}px);
        height: ${rowSpan * rowHeight}px;
        width: ${(colSpan || 1) * columnWidth}px;
        overflow: visible;
      `}
    >
      {@html editing === id ? value : parseLinks(format(value))}
    </div>
  {/each}
</div>
