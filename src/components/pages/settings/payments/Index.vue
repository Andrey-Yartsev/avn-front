<template>
  <Layout ref="layout">
    <AddCard slot="content" @titleChanged="changeTitle" />
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
import User from "@/mixins/user";
import AddCard from "./AddCard";

export default {
  name: "PaymentsSettings",
  mixins: [User],
  components: {
    Layout,
    AddCard
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
