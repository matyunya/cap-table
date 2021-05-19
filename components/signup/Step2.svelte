<script context="module">
  import format from "date-fns/format";

  export const fields = {
    companyName: {
      placeholder: "例）株式会社◯◯◯",
      label: "会社名",
      required: true,
    },
    settlementMonth: {
      placeholder: "",
      label: "決算月",
      type: "select",
      options: [...new Array(12)].map((_, i) => [String(i + 1), (i + 1) + '月']),
      required: true,
    },
    lastSettlementFinished: {
      type: "radio",
      label: "直近決算",
      options: ["決算申告が完了", "決算申告は未済"],
      required: true,
    },
    lastSettlementDate: {
      type: "month",
      placeholder: "",
      active: d => d.lastSettlementFinished === "決算申告が完了",
      label: "決算を終えたのはいつですか",
      required: true,
      max: format(new Date(), "yyyy-MM"),
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

  export let data = {};
  let errors = {};
  export let onSave;
  export let loading;

  async function onSubmit() {
    try {
      loading = true;
      [ok, errors] = validate(data, fields);
      if (ok) {
        await updateProfile(data);
        onSave();
      } else {
        scrollToError();
      }
    } finally {
      loading = false;
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
      {$_("次へ")}
    </button>
  </div>
</form>
