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
    currentPassword: {
      placeholder: "",
      label: "現在のパスワード",
      required: true,
      type: "password",
    },
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

  function resetPassword() {
    [ok, errors] = validate(data, fields);
    if (ok) {
      // set new password
      // window.ellx.login({ email: data.email });
    } else {
      scrollToError();
    }
  }
</script>

<Wrapper title="パスワード再設定">
  <Fields {fields} bind:data bind:errors />
  <div class="text-center mt-6">
    <button
      on:click={resetPassword}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("設定する")}
    </button>
  </div>
</Wrapper>
