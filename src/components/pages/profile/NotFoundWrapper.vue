<template>
  <Loader text="" v-if="loading" />
  <NotFoundPage v-else-if="error" />
  <ProfilePage v-else />
</template>

<script>
import Loader from "@/components/common/Loader";
import ProfilePage from "./Index";
import NotFoundPage from "@/components/pages/notFound/Index";

export default {
  name: "ProfileNotFoundWrapper",

  components: {
    Loader,
    ProfilePage,
    NotFoundPage
  },

  computed: {
    loading() {
      return this.$store.state.profile.home.fetchProfileLoading;
    },
    error() {
      return this.$store.state.profile.home.fetchProfileError;
    }
  },
  watch: {
    $route() {
      if (this.error) {
        this.$router.go();
      }
    }
  }
};
</script>
