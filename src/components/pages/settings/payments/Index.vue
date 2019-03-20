<template>
  <Layout ref="layout">
    <Content
      v-if="appName === 'teams'"
      slot="content"
      @titleChanged="changeTitle"
    />
    <avn-settings-add-card v-else slot="content" @titleChanged="changeTitle" />
    <template slot="title">
      <span class="page-title__category">{{ $route.meta.title }}</span>
      <button
        slot="title"
        @click="$router.push('/settings/credits')"
        class="balance-info"
      >
        Balance: {{ user.creditBalance }} credits
      </button>
    </template>
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
