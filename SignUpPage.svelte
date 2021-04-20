<script>
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Stepper from "/components/Stepper.svelte";
  import Step1 from "/components/signup/Step1.svelte";
  import Step2 from "/components/signup/Step2.svelte";
  import Step3 from "/components/signup/Step3.svelte";
  import route from "/utils/router.js";

  const { regStep } = require("/index.ellx");
</script>

<Wrapper>
  <Stepper n={$regStep} />
  {#if $regStep === 1}
    <Step1 />
  {:else if $regStep === 2}
    <Step2 onSave={() => ($route = "signup/3")} />
  {:else if $regStep === 3}
    <Step3 onSave={() => ($route = "")} />
  {/if}
</Wrapper>
