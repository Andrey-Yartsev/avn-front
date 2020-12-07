<template>
  <div
    class="linksPage links-content"
    :class="{ 'links-content_filled': !loading && links.length }"
  >
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <div v-if="links.length" class="links-wrapper">
        <LinkItem
          v-for="link in links"
          :link="link"
          :key="link.id"
          @edit="editHandler(link)"
        />
      </div>
      <template v-if="!loading && !links.length">
        <p class="empty-feed">
          <span>Nothing here yet</span>
        </p>
      </template>
      <div class="links-add-new" v-if="this.$props.private">
        <button
          class="make-post-btn make-post-btn_feed make-post-btn_color-sec btn-with-icon btn-with-icon_lg"
          @click="openAddLinkModal"
        >
          <span class="icn-item icn-link"></span>
          Add new link
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import LinkItem from "@/components/common/profile/links/LinkItem";
export default {
  name: "LinksPage",
  components: {
    Loader,
    LinkItem
  },
  props: ["private"],
  computed: {
    links() {
      return this.$store.state.profile.links.links;
    },
    loading() {
      return this.$store.state.profile.links.getLinksLoading;
    }
  },
  methods: {
    openAddLinkModal() {
      this.$store.dispatch("modal/show", {
        name: "addLink"
      });
    },
    fetchLinks() {
      this.$store.dispatch(
        "profile/links/getLinks",
        this.$store.state.profile.home.profile.id
      );
    },
    editHandler(link) {
      this.$store.commit("profile/links/startEditLink", link);
      this.$store.dispatch("modal/show", {
        name: "addLink"
      });
    }
  },
  mounted() {
    this.fetchLinks();
  }
};
</script>

<style scoped>
.addLink__button {
  margin-top: 3rem;
}
</style>
