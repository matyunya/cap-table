<script>
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";

  const fields = {
    email: {
      placeholder: "メールアドレス",
      label: "メールアドレス",
    },
    password: {
      placeholder: "",
      label: "パスワード",
      type: "password",
    },
  };

  let data = {};
  let errors = {};

  function login() {
    window.ellx.login(data);
    window.ellx.router.go("/");
  }
</script>

<Wrapper>
  <h2 class="font-bold text-lg mt-6 text-center w-full">ログイン</h2>
  <button class="button w-full">Googleアカウントでログイン</button>
  <hr class="my-8" />
  <Fields {fields} bind:data bind:errors />
  <div class="text-center mt-6">
    <button
      on:click={login}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("ログイン")}
    </button>
  </div>
  <div class="mt-2 w-full text-center">
    <a href="forgot" class="a text-xs">
      {$_("パスワードをお忘れの方")}
    </a>
  </div>
</Wrapper>
