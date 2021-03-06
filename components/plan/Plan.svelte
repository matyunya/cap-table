<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import Year from "/components/plan/Year.svelte";
  import { onMount } from "svelte";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import Icon from "/components/ui/Icon.svelte";
  import Select from "/components/ui/Select.svelte";
  import { getIpoYear } from "/utils/selectors.js";
  import _ from "/utils/intl.js";
  import {
    renamePlan,
    renameProject,
    rowTypes,
    setPlanDocId,
    updateTaxRate,
  } from "/utils/actions/plans.js";
  import { updateLastViewed } from "/utils/actions/generic.js";
  import { getProjectMenuItems } from "/utils/menus.js";
  import cn from "/utils/cn.js";
  import { format } from "/utils/index.js";

  const {
    projects,
    title,
    years,
    sheetStatus,
    docIds,
    docs,
    planDocId,
    taxRate,
  } = require("/index.ellx");

  onMount(updateLastViewed);
</script>

{#if $sheetStatus === "success"}
  <div class="m-12">
    {#if Array.isArray($docIds)}
      <div class="flex space-x-4 items-center mt-20">
        <div class="text-xs">紐づける資本政策</div>
        <Select
          classes="focus:ring-2 w-48 truncate transition p-1 duration-200 text-xs shadow focus:outline-none rounded-xl bg-white dark:bg-black"
          hasEmpty
          value={$planDocId}
          on:change={({ target }) => setPlanDocId({ id: target.value })}
          options={$docIds}
        />
        <div class="text-xs">
          事業計画を作成するには、まず紐付ける資本政策のテーブルを選択してください。<br
          />
          （そのデータが事業計画の「株式資金調達」欄に反映されます。）
        </div>
      </div>
    {/if}
    <div
      class="relative grid auto grid-cols-1 gap-x-2 grid-rows-4 cap-table text-xs text-gray-700 dark:text-gray-200 mt-6 bg-blurred z-40"
      on:click={setEditing}
    >
      <div
        style="top: 0; left: 0;"
        class="sticky border dark:border-gray-700 z-30 bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-sm"
      >
        <div class="text-xs w-full p-2 text-left">
          {$_("計画名")}
        </div>
        <Cell
          class="w-full h-full p-2 text-left truncate items-center flex"
          value={$title}
          on:change={renamePlan}
        />
      </div>
      <div
        style="left: 0;"
        class="col-start-1 row-start-2 border dark:border-gray-700 flex flex-1 flex-col bg-white dark:bg-gray-800 shadow p-1"
      >
        {#each rowTypes as { label, hasProjects, id }, i}
          <div
            class="relative cell"
            class:flex={id === "corporateTaxEffectiveTaxRate"}
          >
            <Cell
              editable={false}
              class={cn({
                "cell p-1 h-6 items-center text-left font-bold": true,
                "tracking-wide text-xs mt-6": i !== 0 && hasProjects,
                "mt-2": i !== 0 && !hasProjects,
                "w-1/2": id === "corporateTaxEffectiveTaxRate",
              })}
              value={label}
            >
              {label}
            </Cell>
            {#if id === "corporateTaxEffectiveTaxRate"}
              <Cell
                class="cell p-1 h-6 items-center text-left font-bold w-1/2 mt-2"
                value={$taxRate}
                on:change={({ detail }) => updateTaxRate({ value: detail })}
              >
                {format.nominalPercent.format($taxRate)}
              </Cell>
            {/if}
          </div>
          {#if hasProjects}
            {#each [...$projects] as [projectId, { title }]}
              <div class="flex cell relative">
                <Cell
                  class="p-1 h-6 items-center text-left"
                  value={title}
                  on:change={({ detail }) =>
                    renameProject({ projectId, title: detail })}
                />
                <div class="w-8" />
                <Icon
                  on:click={(e) =>
                    openContextMenu(getProjectMenuItems({ id: projectId }), e)}
                  rotate="90"
                />
              </div>
            {/each}
          {/if}
        {/each}
      </div>

      {#if $years && $years.length}
        {#each $years as year, i (year)}
          <Year
            last={i === $years.length - 1}
            ipo={getIpoYear($planDocId, $docs)}
            {year}
            {projects}
            {i}
          />
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  .cap-table {
    grid-template-rows: 5rem 1fr;
    /* investor col width */
    grid-template-columns: 200px;
    grid-auto-columns: 1fr;
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
