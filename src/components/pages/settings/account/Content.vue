<template>
  <div :class="viewClass">
    <div class="hidden-desktop" v-if="view === 'email' || view === 'twitter'">
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">{{ user.name }}</span>
        </div>
      </div>
    </div>
    <MobileMenu v-if="view === 'account'" />
    <AllView :class="{'hidden-mobile': view === 'account'}" />
  </div>
</template>

<script>
import MobileMenu from "./MobileMenu";
import MobileEmail from "./MobileEmail";
import AllView from "./AllView";
import User from "@/mixins/user";

export default {
  name: "AccountSettingsContent",

  mixins: [User],

  components: {
    MobileMenu,
    MobileEmail,
    AllView
  },

  computed: {
    view() {
      return this.$route.params.view || "account";
    },
    viewClass() {
      return this.ucFirst(this.view) + "View";
    }
  },

  methods: {
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
};
</script>
