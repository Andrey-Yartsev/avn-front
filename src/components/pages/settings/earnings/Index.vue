<template>
  <Layout ref="layout">
    <Content slot="content" @titleChanged="changeTitle" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "EarningsSettings",

  components: {
    Layout,
    Content
  },

  methods: {
    changeTitle(title) {
      this.$refs.layout.changeTitle(title);
    }
  }
};
</script>
