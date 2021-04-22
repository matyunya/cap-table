<script>
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";

  const fields = {
    email: {
      placeholder: "メールアドレス",
      label: "メールアドレス",
    },
  };

  let data = {};
  let errors = {};

  function resetPassword() {
    window.ellx.login({
      email
    });
    // TODO scrim and such
  }
</script>

<Wrapper>
  <div class="mb-3">
    パスワードをお忘れの方へ、パスワードの再発行を行います。メールアドレスをご入力の上、
    「パスワードを再発行する」ボタンを押して下さい。
  </div>
  <Fields {fields} bind:data bind:errors />
  <div class="text-center mt-6">
    <button
      on:click={resetPassword}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("パスワードを再発行する")}
    </button>
  </div>
  <div class="mt-2 w-full text-center">
    <a href="/login" class="a text-xs">
      {$_("ログインへ戻る")}
    </a>
  </div>
</Wrapper>
