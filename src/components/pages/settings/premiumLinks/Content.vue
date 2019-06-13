<template>
  <div
    class="rounded-container rounded-container_fluid-height"
    id="payouts-container"
  >
    <div class="payouts">
      <div class="PayoutsAccountView" v-if="!user.isWantEarn">
        <h1 class="form-title">
          Premium Links
        </h1>
        <div class="form-title text border-top centered">
          <div class="inner">
            You need to enable <b>Earn money</b> option in
            <router-link to="/settings/profile">Profile</router-link>
            settings
          </div>
        </div>
      </div>
      <Form v-else />
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
