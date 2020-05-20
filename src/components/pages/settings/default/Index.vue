<template>
  <Layout>
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import BrowserStore from "store";

export default {
  name: "ProfileSettings",

  components: {
    Layout,
    Content
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    const magazineRedirect = BrowserStore.get("magazineRedirect");
    if (magazineRedirect && this.user) {
      this.$router.push("/settings/magazine");
    }
  }
};
</script>
