<template>
  <Layout ref="layout">
    <Content
      v-if="appName !== 'avn'"
      slot="content"
      @titleChanged="changeTitle"
    />
    <AddCard v-else slot="content" @titleChanged="changeTitle" />
    <template slot="title">
      <span class="page-title__category">{{ $route.meta.title }}</span>
      <button
        slot="title"
        @click="$router.push('/settings/credits')"
        class="balance-info"
      >
        Balance: {{ user.creditBalance }} credits
      </button>
    </template>
  </Layout>
</template>

<script>
import Layout from "../Layout";
import Content from "./Content";
import User from "@/mixins/user";
import AddCard from "./AddCard";

export default {
  name: "PaymentsSettings",
  mixins: [User],
  components: {
    Layout,
    Content,
    AddCard
  },
  computed: {
    appName() {
      return process.env.VUE_APP_NAME;
    }
  },
  methods: {
    changeTitle(title) {
      setTimeout(() => {
        if (this.$refs.layout) {
          this.$refs.layout.changeTitle(title);
        }
      }, 100);
    }
  }
};
</script>
