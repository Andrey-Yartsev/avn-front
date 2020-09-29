<template>
  <Layout>
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "ProfileSettings",
  components: {
    Layout,
    Content
  }
};
</script>
