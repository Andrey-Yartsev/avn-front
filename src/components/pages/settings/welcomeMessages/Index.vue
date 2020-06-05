<template>
  <Layout ref="layout">
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "WelcomeMessageSettings",

  components: {
    Layout,
    Content
  }
};
</script>
