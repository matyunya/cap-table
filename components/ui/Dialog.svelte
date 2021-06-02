<script>
  import { scale } from "svelte/transition";
  import { quadIn } from "svelte/easing";
  import Scrim from "/components/ui/Scrim.svelte";

  export let value;
  export let onClose = () => {};
  export let onConfirm = () => {};
  export let opacity = 0.5;
  export let modal = false;

  export let transitionProps = { duration: 50, easing: quadIn };

  function close() {
    value = false;
    if (typeof onClose === "function") onClose();
  }
  function confirm() {
    value = false;
    if (typeof onConfirm === "function") onConfirm();
  }

  function listen(e) {
    if (!value) return;

    if (e.key === "Escape") {
      if (modal) return;
      e.preventDefault();
      close();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      confirm();
    }
  }
</script>

<svelte:window on:keydown={listen} />

{#if value}
  <div class="fixed w-full h-full top-0 left-0 z-50">
    <Scrim {opacity} on:click={() => !modal && close()} />
    <div class="h-full w-full absolute flex items-center justify-center">
      <div
        in:scale={transitionProps}
        class="{$$props.class ||
          ""} items-center z-50 shadow-lg bg-white dark:bg-gray-400 p-4"
      >
        <slot />
      </div>
    </div>
  </div>
{/if}
