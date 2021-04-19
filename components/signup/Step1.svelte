<script>
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";

  import { language } from "/store.js";
  let password = "";

  async function register() {
    try {
      error = false;

      Object.keys(data).forEach((key) => {
        errors[key] = !data[key] ? "この項目が必須です。" : false;
      });

      if (
        !Object.keys(errors).reduce(
          (acc, cur) => acc || Boolean(errors[cur]),
          false
        )
      ) {
        await signIn(data.email, data);
      } else {
        const el = document.querySelector(".error");
        if (el) el.scrollIntoView();
      }
    } catch (e) {
      error = e;
    }
  }

  function signIn(email) {
    window.ellx.login({
      email,
      password,
      language: $language,
    });
  }

  export let onSave = () => {};
  export let label = "登録する";
  export let data;
  export let errors;

  const fields = {
    lastName: {
      placeholder: "お名前",
      label: "お名前",
    },
    email: {
      placeholder: "メールアドレス",
      label: "メールアドレス",
    },
    password: {
      placeholder: "",
      label: "パスワード",
      type: "password",
    },
    passwordConfirm: {
      placeholder: "",
      label: "パスワード（確認）",
      type: "password",
    },
  };

  let submitted = false;
</script>

{#if submitted}
  <div class="text-center w-full">
    ご登録ありがとうございます。<br />
    本人認証のために、メールを送信しました。<br />
    メールにて本人認証を行ってください。​
  </div>
{:else}
  <h2 class="font-bold text-lg mt-6 text-center w-full">ユーザー登録</h2>
  <button class="button w-full">Googleアカウントで登録</button>
  <hr class="my-8" />
  <form class="flex-auto dark:text-white">
    <Fields bind:data bind:errors {fields} />

    <div class="flex flex-row justify-evenly">
      <a href="#rules" class="a text-xs">利用規約</a>
      <a href="#privacy" class="a text-xs">プライバシーポリシー に同意の上</a>
    </div>

    <div class="text-center mt-6">
      <button
        on:click={() => {
          onSave(data);
          submitted = true;
        }}
        class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
      >
        {$_(label)}
      </button>
    </div>
  </form>
{/if}
