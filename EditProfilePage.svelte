<script>
  import ProfileForm from "/components/ProfileForm.svelte";
  import { store, userProfile, user, defaultProfile, UPDATE_PROFILE } from "./store.js";
  import _ from "/utils/intl.js";
  import { SYNC_PROFILE } from "/utils/sync.js";
  import { updateProfile } from "/models/profile.js";

  let errors = { ...defaultProfile };

  export let showProfile;

  function onCancelProfileEdit() {
    showProfile = false;
    window.scrollTo(0, 0);
  }

  function update(data) {
    updateProfile(data);

    showProfile = false;
  }

</script>

<div class="flex flex-wrap align-center justify-center">
  <div class="max-w-xl mx-auto w-full lg:w-6/12 px-4">
    <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow rounded bg-gray-300 mt-8 text-gray-800 antialiased bg-gradient-to-r from-blue-gray-100 via-gray-200 to-warm-gray-200"
    >
      <div class="w-full text-center text-lg md:text-2xl text-black mt-12 px-4 uppercase tracking-widest font-bold">
        {$_("プロフィール編集画面")}
      </div>
      <ProfileForm
        initial={false}
        label="保存する"
        data={{ ...$userProfile}}
        {errors}
        onSave={update}
        onCancel={onCancelProfileEdit}
      />
    </div>
  </div>
</div>
