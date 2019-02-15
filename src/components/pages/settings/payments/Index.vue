<template>
  <Layout ref="layout">
    <Content
      v-if="appName === 'teams'"
      slot="content"
      @titleChanged="changeTitle"
    />
    <avn-settings-add-card v-else slot="content" @titleChanged="changeTitle" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "PaymentsSettings",

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
