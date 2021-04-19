<script context="module">
  import { writable } from "svelte/store";
  import CellEditor from "/components/sheet/CellEditor.svelte";
  const { isAnon } = require("/index.ellx");

  const editing = writable(false);

  export function setEditing(e) {
    if (e.target.dataset && e.target.getAttribute("disabled") !== "true") {
      editing.set(e.target.dataset.id);
    }
  }
</script>

<script>
  import { uid } from "/utils/index.js";
  import { createEventDispatcher } from "svelte";


  export let id = uid();
  export let value;
  export let editable = true;
  export let editorClasses = "";

  let editingValue = value;

  $: editable = editable && !$isAnon;

  const dispatch = createEventDispatcher();

  function save() {
    dispatch("change", editingValue);

    editing.set(false);
    value = "...";
  }

  function onKeydown(e) {
    if (!$editing) return;

    if (["Escape"].includes(e.code)) {
      e.preventDefault();
    } else {
      return;
    }

    if (e.code === "Escape") {
      $editing = false;
      editingValue = value;
    }
  }

  function onInput(e) {
    if (e.target.value.includes("\n")) {
      editingValue = e.target.value.replace(/\n/, "");
      save();
    }
  }
</script>

<div
  data-id={id}
  disabled={!editable}
  class="{$$props.class ||
    ''} ring-0 transition duration-75 ring-light-blue-500 overflow-hidden"
  class:dark:text-light-blue-200={editable}
  class:text-light-blue-600={editable}
  class:ring-2={$editing === id}
  class:hover:ring-light-blue-400={$editing === id}
  class:hover:ring-1={$editing !== id && editable}
  style={$$props.style || ""}
  title={value}
>
  {#if $editing !== id}
    <slot>{value}</slot>
  {:else}
    <CellEditor
      class={editorClasses}
      {id}
      {save}
      bind:value={editingValue}
      on:keydown={onKeydown}
      on:input={onInput}
    >
      <slot name="editor" />
    </CellEditor>
  {/if}
</div>

<style>
  div :global(textarea) {
    text-align: right;
  }

  :global(div.text-left) :global(textarea) {
    text-align: left;
  }
  :global(div.text-center) :global(textarea) {
    text-align: center;
  }
</style>