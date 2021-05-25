<script>
  import Label from "/components/ui/Label.svelte";
  import _ from "/utils/intl.js";

  export let errors = {};
  export let data = {};
</script>

<span class="block text-sm font-bold mb-2 mt-8">
  {$_("従業員数")}
</span>
<div>
  <div class="flex flex-col items-start text-xs mb-2">
    <Label
      class="flex-1"
      id="正社員"
      label={$_("正社員")}
      error={errors.fullTimeEmployees}
    />
    <div class="flex flex-row items-center">
      <input
        value={data.fullTimeEmployees}
        required
        class="focus:ring-2 text-right transition duration-200 w-16 p-1 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl text-sm shadow focus:outline-none focus:shadow-outline"
        id="j"
        placeholder=" 例) 10"
        type="number"
        on:input={(e) => {
          data.fullTimeEmployees = +e.target.value;
          errors.fullTimeEmployees = "";
        }}
      />
      <span class="ml-2">{$_("人")}</span>
    </div>
  </div>
  <div class="flex flex-col items-start text-xs mt-4">
    <Label
      class="flex-1"
      id="業務委託"
      label={$_("業務委託")}
      error={errors.contractors}
    />
    <div class="flex flex-row items-center">
      <input
        value={data.contractors}
        required
        class="focus:ring-2 text-right transition duration-200 w-16 p-1 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl text-sm shadow focus:outline-none focus:shadow-outline"
        id="n"
        placeholder=" 例) 11"
        type="number"
        on:input={(e) => {
          data.contractors = +e.target.value;
          errors.contractors = "";
        }}
      />
      <span class="ml-2">{$_("人")}</span>
    </div>
  </div>
</div>
