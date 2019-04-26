<template>
  <Layout>
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "TrialsSettings",

  components: {
    Layout,
    Content
  }
};
</script>
