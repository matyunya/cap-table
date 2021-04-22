<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import Round, { calculateWidth } from "/components/sheet/Round.svelte";
  import ContextMenu, {
    openContextMenu,
  } from "/components/ui/ContextMenu.svelte";
  import Icon from "/components/ui/Icon.svelte";
  import _ from "/utils/intl.js";
  import {
    renameDocument,
    renameInvestorGroup,
    renameInvestor,
    updateInvestorTitle,
    updateLastViewed,
  } from "/utils/actions.js";
  import cn from "/utils/cn.js";
  import { investorGroupMenuItems, investorMenuItems } from "/utils/menus.js";

  const {
    investorGroups,
    title,
    rounds,
    calculated,
    investors,
    activeSheet,
    isAnon,
    sheetReady,
  } = require("/index.ellx");

  sheetReady.subscribe((v) => {
    if (!$isAnon && v && v !== "@@io.ellx.STALE" && !(v instanceof Error)) {
      updateLastViewed();
    }
  });
</script>

<div
  class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800"
/>

<ContextMenu />

{#if $activeSheet}
  <div
    style="width: {calculateWidth($rounds)}px"
    class="relative grid auto grid-cols-1 grid-rows-4 cap-table text-xs gap-x-2 m-8 mt-4 text-gray-700 dark:text-gray-200"
    on:click={setEditing}
  >
    <Cell
      style="top: 0; left: 0;"
      class="text-center sticky border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex items-center justify-center font-mono text-sm shadow"
      value={$title}
      on:change={renameDocument}
    />
    <div
      style="left: 0;"
      class="col-start-1 row-start-2 sticky border dark:border-gray-700 flex flex-1 flex-col bg-white dark:bg-gray-800 shadow p-1"
    >
      {#each $investorGroups as { id, label, isGroup, title, group }, i}
        {#if isGroup}
          <Cell
            class={cn({
              "cell p-1 h-6 items-center text-left font-bold relative": true,
              "tracking-wide text-xs border-t dark:border-gray-600 mt-4":
                i !== 0,
            })}
            value={label}
            on:change={({ detail }) =>
              renameInvestorGroup({ oldName: label, newName: detail })}
          >
            {label}
            {#if !$isAnon}
              <Icon
                on:click={(e) =>
                  openContextMenu(
                    investorGroupMenuItems(label, $investors, i === 0),
                    e
                  )}
                rotate="90"
              />
            {/if}
          </Cell>
        {:else}
          <div class="flex cell relative">
            <Cell
              class="p-1 h-6 items-center text-left w-1/2"
              value={label}
              on:change={({ detail }) =>
                renameInvestor({ investorId: id, value: detail })}
            />
            <Cell
              class="p-1 h-6 items-center text-right text-xs font-mono font-thin w-1/3 opacity-75"
              editorClasses="w-full h-full"
              value={title}
              on:change={({ detail }) =>
                updateInvestorTitle({ investorId: id, value: detail })}
            />
            <div class="w-8" />
            {#if !$isAnon}
              <Icon
                on:click={(e) =>
                  openContextMenu(investorMenuItems(id, group), e)}
                rotate="90"
              />
            {/if}
          </div>
        {/if}
      {/each}
      <div
        class="p-1 pt-3 items-center text-left font-bold tracking-widest font-mono border-t dark:border-gray-600 mt-4"
      >
        {$_("合計")}
      </div>
    </div>

    <!-- reserved for controls -->
    <div class="col-start-1 row-start-3 h-8" />

    <div
      style="left: 0;"
      class="col-start-1 row-start-4 sticky p-1 border dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 shadow"
    >
      <div class="p-1 h-6 items-center">{$_("株価")}</div>
      <div class="p-1 h-6 items-center">{$_("調達金額")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Pre）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Post）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Pre/潜在込）")}</div>
      <div class="p-1 h-6 items-center">{$_("時価総額（Post/潜在込）")}</div>
    </div>

    {#if $rounds && $rounds.values}
      {#each [...$rounds.keys()] as roundId (roundId)}
        <Round
          id={roundId}
          {...$rounds.get(roundId)}
          result={$calculated[roundId]}
        />
      {/each}
    {/if}
  </div>
{/if}

<style>
  .cap-table {
    grid-template-rows: 4rem 1fr;
    /* investor col width */
    grid-template-columns: 200px;
    grid-auto-columns: auto;
    width: auto;
  }

  .auto {
    grid-auto-flow: column;
  }

  :global(.cell:hover .icon) {
    opacity: 1;
  }

  :global(.cell .icon) {
    opacity: 0;
  }
</style>
