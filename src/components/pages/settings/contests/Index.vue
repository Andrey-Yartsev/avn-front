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
  }
};
</script>
