<template>
  <Layout>
    <!-- <template slot="title"
      >{{ isGay ? "GayVN" : "AVN" }} Awards Voting Links</template
    > -->
    <!-- <Content slot="content" /> -->
    <template slot="title">
      {{ isGay ? "GayVN" : "AVN" }} Awards Pre-Nominations Link Generator
    </template>
    <PreNominationContent slot="content" />
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import PreNominationContent from "./PreNominationContent";

export default {
  name: "NotificationSettings",
  components: {
    Layout,
    Content,
    PreNominationContent
  },
  computed: {
    isGay() {
      return !!this.$route.path.match(/gayvn/);
    }
  }
};
</script>
