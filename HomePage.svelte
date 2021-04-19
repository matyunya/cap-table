<script>
  import router from "/utils/router.js";
  import _ from "/utils/intl.js";
</script>

<main>
  <section class="relative block py-24 lg:pt-0">
    <div class="container mx-auto px-4 flex flex-col">
      <h1 class="text-center text-6xl pt-8 font-bold tracking-widest uppercase">
        Capital Dash
      </h1>
      <div class="text-center mt-8 text-lg">
        {$_("資本政策表を失敗せず、簡単に作れる。")}
      </div>
      <div class="mx-auto max-w-lg my-8">
        はじめに・・・<br />
        本ツールでは、簡単３ステップで、資金調達に必要な準備（資本政策表作成、株価算定）ができます。<br
        />
        時間とチャンスを無駄にしないように、投資家に会う前にしっかりと理論武装しましょう。
      </div>

      <a
        on:click={() => ($router = "signup")}
        class="mx-auto max-w-sm"
        href="#signup"
      >
        <button class="button">{$_("新規登録")}</button>
      </a>
    </div>
  </section>
</main>
