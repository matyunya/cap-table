<script>
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Stepper from "/components/Stepper.svelte";
  import Step1 from "/components/signup/Step1.svelte";
  import Step2 from "/components/signup/Step2.svelte";
  import Step3 from "/components/signup/Step3.svelte";
  import route from "/utils/router.js";

  const { regStep } = require("/index.ellx");

  let data = {
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };
  let errors = {};

</script>

<Wrapper>
  <Stepper n={$regStep} />
  {#if $regStep === 1}
    <Step1 {data} {errors} onSave={() => console.log(data)} />
  {:else if $regStep === 2}
    <Step2 {data} {errors} onSave={() => $route = "signup/3"} />
  {:else if $regStep === 3}
    <Step3 {data} {errors} onSave={() => $route = "signup/3"} />
  {/if}
</Wrapper>
