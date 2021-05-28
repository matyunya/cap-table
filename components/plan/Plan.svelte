<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import Round, { calculateWidth } from "/components/sheet/Round.svelte";
  import { onMount } from "svelte";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import Icon from "/components/ui/Icon.svelte";
  import _ from "/utils/intl.js";
  import {
    renameDocument,
    renameInvestorGroup,
    renameInvestor,
    updateInvestorTitle,
    updateLastViewed,
  } from "/utils/actions/docs.js";
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
    sheetChanged,
    docId,
    isAuthenticated,
  } = require("/index.ellx");

  onMount(() =>
    sheetChanged.subscribe((v) => {
      v &&
        v === docId.get() &&
        !v.startsWith("@@io.ellx.STALE") &&
        $isAuthenticated === true &&
        updateLastViewed();
    })
  );
</script>

{#if $activeSheet}
  <div style="width: {calculateWidth($rounds) + 300}px;">
    <div
      style="width: {calculateWidth($rounds)}px;"
      class="relative grid auto grid-cols-1 grid-rows-4 cap-table text-xs gap-x-2 m-12 text-gray-700 dark:text-gray-200 mt-12 bg-blurred z-40 p-4"
      on:click={setEditing}
    >
      <div
        style="top: 0; left: 0;"
        class="text-center sticky border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-sm shadow"
      >
        <div class="text-xs w-full p-2 text-left">
          {$_("テーブル名")}
        </div>
        <Cell
          class="w-full h-full p-2 text-left truncate"
          value={$title}
          on:change={renameDocument}
        />
      </div>
      <div
        style="left: 0;"
        class="col-start-1 row-start-2 sticky border dark:border-gray-700 flex flex-1 flex-col bg-white dark:bg-gray-800 shadow p-1"
      >
        {#each $investorGroups as { id, label, isGroup, title, group }, i}
          {#if isGroup}
            <div class="relative cell">
              <Cell
                class={cn({
                  "cell p-1 h-6 items-center text-left font-bold": true,
                  "tracking-wide text-xs border-t dark:border-gray-600 mt-4":
                    i !== 0,
                })}
                value={label}
                on:change={({ detail }) =>
                  renameInvestorGroup({ oldName: label, newName: detail })}
              >
                {label}
              </Cell>
              {#if !$isAnon}
                <Icon
                  class={cn({ "mt-4": i !== 0 })}
                  on:click={(e) =>
                    openContextMenu(
                      investorGroupMenuItems(label, $investors, i === 0),
                      e
                    )}
                  rotate="90"
                />
              {/if}
            </div>
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
                    openContextMenu(investorMenuItems(id, group, investors), e)}
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
        <div class="p-1 h-6 items-center">{$_("税引前当期損益")}</div>
        <div class="p-1 h-6 items-center">{$_("法人税（実効税率）")}</div>
        <div class="p-1 h-6 items-center">{$_("当期利益")}</div>
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
