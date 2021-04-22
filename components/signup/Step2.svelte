<script>
  import Fields from "/components/signup/Fields.svelte";
  import Label from "/components/ui/Label.svelte";
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { validate, scrollToError } from "/utils/forms.js";

  let data = {};
  let errors = {};
  export let onSave;

  const fields = {
    companyName: {
      placeholder: "会社名",
      label: "会社名",
      required: true,
    },
    settlementDate: {
      placeholder: "",
      label: "決算月",
      type: "month",
      required: true,
    },
    lastSettlementFinished: {
      type: "radio",
      label: "直近決算",
      options: ["終わっていない", "終わっている"],
      required: true,
    },
    fullTimeEmployees: {
      ignore: true,
      required: true,
    },
    contractors: {
      ignore: true,
      required: true,
    },
  };

  function onSubmit() {
    [ok, errors] = validate(data, fields);
    if (ok) {
      updateProfile(data);
      onSave();
    } else {
      scrollToError();
    }
  }
</script>

<form class="flex-auto dark:text-white">
  <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">{$_("会社情報")}</h2>
  <Fields bind:data bind:errors {fields} />

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

  <div class="text-center mt-6">
    <button
      on:click={onSubmit}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("登録する")}
    </button>
  </div>
</form>
