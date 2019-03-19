<template>
  <Layout ref="layout">
    <Content slot="content" />
    <span class="balance-info" slot="after-title"
      >Balance: {{ user.creditBalance }} credits</span
    >
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import User from "@/mixins/user";

export default {
  name: "CreditsSettings",
  mixins: [User],
  components: {
    Layout,
    Content
  }
};
</script>
