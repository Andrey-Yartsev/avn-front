<template>
  <div class="rounded-container" id="payouts-container">
    <div class="payouts payouts_height-reset">
      <Form v-if="user.canEarn" />
      <div class="PayoutsAccountView" v-else>
        <h1 class="form-title settings-title">
          Premium Links
        </h1>
        <div class="form-title form-title_default-text border-top centered">
          You need to enable <b>Earn money</b> option in
          <router-link to="/settings/profile">Profile</router-link>
          settings and add a <b>Bank account</b> in
          <router-link to="/settings/payouts">Payouts</router-link> settings.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "./Form";
import User from "@/mixins/user";

export default {
  name: "PremiumLinksContent",
  mixins: [User],
  components: {
    Form
  }
};
</script>
