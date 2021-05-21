<script>
  import { onMount } from "svelte";
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";
  import { validate, scrollToError, length } from "/utils/forms.js";
  import { loginWithGoogle } from "/models/profile.js";
  import { auth, isAuthenticated } from "/index.ellx";

  const fields = {
    email: {
      placeholder: "メールアドレス",
      label: "メールアドレス",
      required: true,
    },
    password: {
      placeholder: "",
      label: "パスワード",
      type: "password",
      required: true,
      validate: length(8),
    },
  };

  let data = {};
  let errors = {};
  let submitted = false;

  function login() {
    [ok, errors] = validate(data, fields);
    if (ok) {
      window.ellx.login(data);
      submitted = true;
    } else {
      scrollToError();
    }
  }

  onMount(() =>
    isAuthenticated.subscribe(
      (v) => v === true && window.ellx.router.go("/dashboard")
    )
  );
</script>

<Wrapper>
  <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
    {$_("ログイン")}
  </h2>
  <button on:click={loginWithGoogle()} class="button w-full">
    {$_("Googleアカウントでログイン")}
  </button>
  <hr class="my-8" />
  <Fields {fields} bind:data bind:errors />
  <div class="text-center mt-6">
    <button
      on:click={login}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded-xl shadow-lg hover:shadow-xl outline-none focus:outline-none mr-1 mb-1"
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
  {#if submitted && $auth instanceof Error}
    <div class="text-red-500 w-full text-center mt-8">{$auth}</div>
  {/if}
</Wrapper>
