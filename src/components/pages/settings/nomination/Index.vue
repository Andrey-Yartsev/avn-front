<template>
  <Layout>
    <template slot="title"
      >{{ isGay ? "GayVN" : "AVN" }} Awards Pre-Nominations Link
      Generator</template
    >
    <Content slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "NotificationSettings",
  components: {
    Layout,
    Content
  },
  computed: {
    isGay() {
      return !!this.$route.path.match(/gayvn/);
    }
  }
};
</script>
