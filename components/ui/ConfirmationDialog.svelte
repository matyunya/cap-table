<script context="module">
  import { writable } from "svelte/store";

  const dialogProps = writable(null);

  export function promptYesNo(props) {
    return new Promise((resolve) =>
      dialogProps.set({ ...props, resolve })
    ).finally(() => dialogProps.set(null));
  }
</script>

<script>
  import Dialog from "/components/ui/Dialog.svelte";
  const noop = () => {};

  $: ({
    resolve = noop,
    title,
    yesText = "Yes",
    noText = "Cancel",
    modal,
  } = $dialogProps || {});
</script>

<Dialog
  value={$dialogProps}
  {modal}
  onClose={() => resolve(false)}
  onConfirm={() => resolve(true)}
>
  <h5>{title}</h5>
  <div class="flex pt-8 text-sm font-medium">
    <div class="flex-grow" />
    <button class="button p-1　text-xs" on:click={() => resolve(false)}>
      {noText}
    </button>
    <button
      class="button bg-red-600 hover:bg-red-500 p-1 text-xs w-32"
      on:click={() => resolve(true)}
    >
      {yesText}
    </button>
  </div>
</Dialog>
