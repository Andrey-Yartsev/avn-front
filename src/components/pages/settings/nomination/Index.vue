<template>
  <Layout>
    <template v-if="isGay">
      <template v-if="isVotingGayEnabled">
        <template slot="title"
          >GayVN Awards Voting Links</template
        >
        <Content slot="content" />
      </template>
      <template v-else>
        <template slot="title">
          GayVN Awards Pre-Nominations Link Generator
        </template>
        <PreNominationContent slot="content" />
      </template>
    </template>

    <template v-else>
      <template v-if="isVotingEnabled">
        <template slot="title"
          >AVN Awards Voting Links</template
        >
        <Content slot="content" />
      </template>
      <template v-else>
        <template slot="title">
          AVN Awards Pre-Nominations Link Generator
        </template>
        <PreNominationContent slot="content" />
      </template>
    </template>
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
    },
    isVotingEnabled() {
      return this.$store.state.init.data.enableVoting;
    },
    isVotingGayEnabled() {
      return this.$store.state.init.data.enableGayVoting;
    }
  },
  created() {
    if (!this.$store.state.auth.user.canEarn) {
      this.$router.push("/settings");
    }
  }
};
</script>
