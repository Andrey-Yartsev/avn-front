<template>
  <Layout ref="layout">
    <Content slot="content" />
    <template slot="title">
      Contests
    </template>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
// import User from "@/mixins/user";

export default {
  name: "ContestsSettings",
  // mixins: [User],
  components: {
    Layout,
    Content
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    allowContestsView() {
      return (
        this.user.adminReturnUrl ||
        (this.user?.canEarn && this.$store.state.init?.data?.enableContests)
      );
    }
  },
  mounted() {
    if (!this.allowContestsView) {
      this.$router.push("/settings");
      return;
    }
  }
};
</script>
