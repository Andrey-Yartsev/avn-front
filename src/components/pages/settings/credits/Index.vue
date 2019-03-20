<template>
  <Layout ref="layout">
    <Content slot="content" />
    <template slot="title">
      <span class="page-title__category">{{ $route.meta.title }}</span>
      <span class="balance-info"
        >Balance: {{ user.creditBalance }} credits</span
      >
    </template>
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
