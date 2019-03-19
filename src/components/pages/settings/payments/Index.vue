<template>
  <Layout ref="layout">
    <Content
      v-if="appName === 'teams'"
      slot="content"
      @titleChanged="changeTitle"
    />
    <avn-settings-add-card v-else slot="content" @titleChanged="changeTitle" />
    <button
      slot="after-title"
      @click="$router.push('/settings/credits')"
      class="hidden-desktop"
    >
      Balance: {{ user.creditBalance }} credits
    </button>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import User from "@/mixins/user";

export default {
  name: "PaymentsSettings",
  mixins: [User],
  components: {
    Layout,
    Content
  },
  computed: {
    appName() {
      return process.env.VUE_APP_NAME;
    }
  },
  methods: {
    changeTitle(title) {
      setTimeout(() => {
        this.$refs.layout.changeTitle(title);
      }, 100);
    }
  }
};
</script>
