<script>
  import Input from "/components/ui/Input.svelte";
  import _ from "/utils/intl.js";
  export let fields;
  export let data;
  export let errors;
  export let update = (field) => (e) => (data[field] = e.target.value);
</script>

{#each Object.keys(fields) as field}
  <Input
    on:change={update(field)}
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
{/each}
