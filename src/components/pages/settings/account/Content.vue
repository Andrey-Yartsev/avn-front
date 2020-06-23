<template>
  <div :class="viewClass">
    <div
      class="hidden-desktop"
      v-if="view === 'email' || view === 'twitter' || view === 'google'"
    >
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">{{ user.name }}</span>
        </div>
      </div>
    </div>
    <MobileMenu v-if="view === 'account'" />
    <AllView :class="{ 'hidden-mobile': view === 'account' }" />
  </div>
</template>

<script>
import MobileMenu from "./MobileMenu";
import AllView from "./AllView";
import User from "@/mixins/user";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "AccountSettingsContent",

  mixins: [User],

  components: {
    MobileMenu,
    AllView
  },

  computed: {
    view() {
      return this.$route.params.view || "account";
    },
    viewClass() {
      return ucFirst(this.view) + "View";
    }
  }
};
</script>
