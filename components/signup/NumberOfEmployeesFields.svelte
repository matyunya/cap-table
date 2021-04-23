<script>
  import Label from "/components/ui/Label.svelte";
  import _ from "/utils/intl.js";

  export let errors = {};
  export let data = {};
</script>

<span class="block text-xs font-bold mb-2 mt-8">
  {$_("従業員数")}
</span>
<div class="w-48">
  <div class="flex flex-row items-center text-xs mb-2">
    <Label
      class="flex-1"
      id="正社員"
      label={$_("正社員")}
      error={errors.fullTimeEmployees}
    />
    <input
      value={data.fullTimeEmployees}
      required
      class="focus:ring-2 transition duration-200 w-16 p-1 mx-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline"
      id="j"
      type="number"
      on:input={(e) => {
        data.fullTimeEmployees = +e.target.value;
        errors.fullTimeEmployees = "";
      }}
    />
    <span>{$_("人")}</span>
  </div>
  <div class="flex flex-row items-center text-xs">
    <Label
      class="flex-1"
      id="業務委託"
      label={$_("業務委託")}
      error={errors.contractors}
    />
    <input
      value={data.contractors}
      required
      class="focus:ring-2 transition duration-200 w-16 p-1 mx-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline"
      id="n"
      type="number"
      on:input={(e) => {
        data.contractors = +e.target.value;
        errors.contractors = "";
      }}
    />
    <span>{$_("人")}</span>
  </div>
</div>
