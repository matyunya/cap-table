<script>
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";
  import {
    passwordRules,
    passwordConfirmRules,
    validate,
    scrollToError,
  } from "/utils/forms.js";

  const fields = {
    password: {
      placeholder: "",
      label: "新しいパスワード",
      type: "password",
      required: true,
      validate: passwordRules,
    },
    confirm: {
      placeholder: "",
      label: "新しいパスワード（確認）",
      type: "password",
      required: true,
      validate: passwordConfirmRules,
    },
  };

  let data = {};
  let errors = {};
  let ok = false;
  let loading = false;
  let success = false;

  async function resetPassword() {
    try {
      [ok, errors] = validate(data, fields);
      if (ok) {
        loading = true;
        await window.ellx.login.setPassword({ newPassword: data.password });
        success = true;
      } else {
        scrollToError();
      }
    } finally {
      loading = false;
    }
  }
</script>

<Wrapper {loading} {success} title="パスワード再設定">
  <Fields {fields} bind:data bind:errors />
  <div class="text-center mt-6">
    <button
      on:click={resetPassword}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded-xl shadow-lg hover:shadow-xl outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("設定する")}
    </button>
  </div>
  <div slot="success">
    <div class="mb-8 text-center">
      {@html $_(`設定されました`)}
    </div>
  </div>
</Wrapper>
