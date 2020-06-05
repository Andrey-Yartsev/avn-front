<template>
  <Layout ref="layout">
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "MagazineSettings",

  components: {
    Layout,
    Content
  }
};
</script>
