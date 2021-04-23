<script context="module">
  export const fields = {
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
</script>

<script>
  import Fields from "/components/signup/Fields.svelte";
  import NumberOfEmployeesFields from "/components/signup/NumberOfEmployeesFields.svelte";

  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { validate, scrollToError } from "/utils/forms.js";

  let data = {};
  let errors = {};
  export let onSave;

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

  <NumberOfEmployeesFields bind:data bind:errors />

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
