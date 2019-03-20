<template>
  <Layout>
    <Content slot="content" />
    <span v-if="title" slot="title" class="page-title__category">{{
      title
    }}</span>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";

export default {
  name: "StorySettings",

  components: {
    Layout,
    Content
  },
  computed: {
    title() {
      if (this.$route.params.view) {
        return "Story blocked users";
      }
      return null;
    }
  }
};
</script>
