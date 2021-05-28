<script>
  import Input from "/components/ui/Input.svelte";
  import Select from "/components/ui/Select.svelte";
  import Label from "/components/ui/Label.svelte";
  import _ from "/utils/intl.js";

  export let fields;
  export let data;
  export let errors;
  export let update =
    (field, transform = (i) => i) =>
    (e) =>
      (data[field] = transform(e.target.value));

  $: activeFields = Object.keys(fields).filter(
    (r) =>
      !fields[r].ignore && (fields[r].active ? fields[r].active(data) : true)
  );
</script>

{#each activeFields as field}
  {#if fields[field].type === "radio"}
    <Label
      id={field}
      required={fields[field].required}
      error={errors[field]}
      label={fields[field].label}
      class="flex-1 mt-6 mb-2 text-xs"
    />
    <div class="flex flex-row items-center max-w-sm text-xs">
      {#each fields[field].options as option, i}
        <input
          class="mr-2"
          id={option}
          type="radio"
          bind:group={data[field]}
          on:click={() => (errors[field] = "")}
          value={option}
        />
        <label class="mr-4" for={option}>
          {$_(option)}
        </label>
      {/each}
    </div>
  {:else if fields[field].type === "checkbox"}
    <Label
      id={field}
      required={fields[field].required}
      error={errors[field]}
      label={fields[field].label}
      class="flex-1 mt-6 mb-2 text-xs"
    />

    <div
      class="flex flex-row items-center justify-between max-w-sm text-xs flex-wrap"
    >
      {#each fields[field].options as type}
        <div class="w-1/2 flex items-center mb-2">
          <input
            bind:group={data[field]}
            class="mr-3 text-blue-500 transition duration-100 ease-in-out border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-light-blue-500 focus:ring-opacity-50 focus:ring-offset-0"
            id={type}
            type="checkbox"
            value={type}
          />
          <label for={type}>
            {$_(type)}
          </label>
        </div>
      {/each}
    </div>
  {:else if fields[field].type === "select"}
    <Select
      options={fields[field].options}
      value={data[field] || ""}
      error={errors[field]}
      type={fields[field].type || "text"}
      placeholder={$_(fields[field].placeholder)}
      label={$_(fields[field].label)}
      id={field}
      on:change={(e) => (data[field] = e.target.value)}
    />
  {:else}
    <Input
      classes="mt-6"
      on:input={update(field, fields[field].transform || ((i) => i))}
      {...fields[field]}
      value={data[field] || ""}
      error={errors[field]}
      type={fields[field].type || "text"}
      placeholder={$_(fields[field].placeholder)}
      label={$_(fields[field].label)}
      id={field}
    />
    <div class="text-xs text-gray-600 dark:text-gray-200">
      {#if field === "password"}
        {$_("半角英数字8文字以上")}
      {/if}
    </div>
  {/if}
{/each}
