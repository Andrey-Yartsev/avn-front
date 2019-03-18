<template>
  <div class="border-top email-block field-invalid">
    Mobile emiol
    <div class="shadow-block">
      <div class="container">
        <div class="form-group">
          <label class="form-group-inner">
            <span class="label"
              ><span class="for-verified">Your email</span
              ><span class="for-unverified"
                >Please confirm your email</span
              ></span
            >
            <input
              class="input-email"
              name="email"
              value="andrey.yartsev.g+15@yandex.ru"
            />
          </label>
        </div>
        <div
          class="form-group hidden-mobile email-confirm-block"
          id="confirm-email-block"
        >
          <div class="form-group-inner">
            <span class="label"></span>
            <button
              type="button"
              class="btn border btn_fix-width-lg btn-confirm-email"
            >
              Re-send confirmation email
            </button>
          </div>
        </div>
        <div
          class="form-group hidden-mobile email-confirm-block hidden"
          id="change-email-block"
        >
          <div class="form-group-inner">
            <span class="label"></span>
            <button
              type="button"
              class="btn border btn_fix-width-lg btn-confirm-email"
            >
              Save new email
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-centered hidden-desktop email-confirm-block">
      <button
        type="button"
        class="btn lg border btn_fix-width-lg btn-confirm-email"
        id="confirm-email-block-mobile"
      >
        Re-send confirmation email
      </button>
      <button
        type="button"
        class="btn lg border btn_fix-width-lg btn-confirm-email hidden"
        id="change-email-block-mobile"
      >
        Save new email
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsAccountMobileEmail"
};
</script>
