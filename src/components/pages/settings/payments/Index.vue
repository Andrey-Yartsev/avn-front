<template>
  <Layout>
    <Content v-if="appName === 'teams'" slot="content" />
    <avn-settings-add-card v-else slot="content" />
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
  }
};
</script>
