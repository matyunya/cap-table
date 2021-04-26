<script context="module">
  import {
    passwordRules,
    passwordConfirmRules,
    validate,
    scrollToError,
  } from "/utils/forms.js";
  import { updateProfile, loginWithGoogle } from "/models/profile.js";

  export const fields = {
    name: {
      placeholder: "お名前",
      label: "お名前",
      required: true,
    },
  };

  const privateFields = {
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
      validate: passwordRules,
    },
    confirm: {
      placeholder: "",
      label: "パスワード（確認）",
      type: "password",
      required: true,
      validate: passwordConfirmRules,
    },
  };
</script>

<script>
  import { onMount } from "svelte";
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";

  import { language, DEFAULT_LANGUAGE } from "/store.js";

  const { userId } = require("/index.ellx");

  let data = {};
  let errors = {};
  let ok = false;
  export let loading;

  async function signUp() {
    try {
      loading = true;
      [ok, errors] = validate(data, { ...fields, ...privateFields });
      if (ok) {
        window.ellx.login.withLink({
          email: data.email,
          password: data.password,
          language: $language,
          redirectUrl: "/signup/2",
        });
        // todo: save name to ls from this page
        submitted = true;
      } else {
        scrollToError();
      }
    } finally {
      loading = false;
    }
  }

  onMount(() =>
    userId.subscribe((v) => {
      if (
        v &&
        !(v instanceof Error) &&
        typeof v === "string" &&
        !v.startsWith("@@io.ellx.STALE")
      ) {
        updateProfile({
          language: $language || DEFAULT_LANGUAGE,
          name: data.name || "",
        });
        window.ellx.router.go("/signup/2");
      }
    })
  );

  export let label = "登録する";

  let submitted = false;
</script>

{#if submitted}
  <div class="text-center w-full my-8">
    {@html $_(`ご登録ありがとうございます。<br />
    本人認証のために、メールを送信しました。<br />
    メールにて本人認証を行ってください。​`)}
  </div>
{:else}
  <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
    {$_("ユーザー登録")}
  </h2>
  <button on:click={loginWithGoogle("/signup/2")} class="button w-full">
    {$_("Googleアカウントで登録")}
  </button>
  <hr class="my-8" />
  <form class="flex-auto dark:text-white">
    <Fields bind:data bind:errors fields={{ ...fields, ...privateFields }} />

    <div class="flex flex-row justify-evenly">
      <a href="rules" class="a text-xs">{$_("利用規約")}</a>
      <a href="privacy" class="a text-xs"
        >{$_("プライバシーポリシー に同意の上")}</a
      >
    </div>

    <div class="text-center mt-6">
      <button
        on:click={() => {
          signUp(data);
        }}
        class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
      >
        {$_(label)}
      </button>
    </div>
  </form>
{/if}
