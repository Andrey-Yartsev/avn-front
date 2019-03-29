<template>
  <Layout>
    <Content slot="content" />
    <template slot="title">{{ title }}</template>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "StorySettings",
  components: {
    Layout,
    Content
  },
  computed: {
    title() {
      if (this.$route.params.view) {
        return ucFirst(this.$route.params.view);
      } else {
        return "Privacy";
      }
    }
  }
};
</script>
