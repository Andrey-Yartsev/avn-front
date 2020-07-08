<template>
  <Layout>
    <Content slot="content" />
    <span
      v-if="showUsernameAsTitle"
      slot="title"
      class="page-title__username"
      >{{ user.name }}</span
    >
    <span v-else slot="title" class="page-title__category">{{ title }}</span>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import User from "@/mixins/user";

export default {
  name: "AccountSettings",
  mixins: [User],
  components: {
    Layout,
    Content
  },
  computed: {
    title() {
      return this.accountViewToTitle(this.$route.params.view);
    },
    showUsernameAsTitle() {
      return !this.$route.params.view;
    }
  },
  methods: {
    accountViewToTitle(view) {
      const map = {
        email: "Email",
        twitter: "Twitter",
        password: "Password",
        manage: "Manage Account",
        google: "Google"
      };
      return map[view];
    }
  }
};
</script>
