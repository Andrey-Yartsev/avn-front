<template>
  <div class="linksPage">
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <div v-if="links.length" class="links">
        <LinkPost
          v-for="link in links"
          :link="link"
          :key="link.id"
          @edit="editHandler(link)"
          @delete="deleteHandler(link)"
        />
      </div>
      <template v-if="!loading && !links.length">
        <p class="empty-feed">
          <span>
            Nothing here yet
          </span>
        </p>
      </template>
      <button
        v-if="this.$props.private"
        class="addLink__button make-post-btn make-post-btn_feed make-post-btn_color-sec btn-with-icon btn-with-icon_lg"
        @click="openAddLinkModal"
      >
        Add new link
      </button>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import LinkPost from "@/components/addLink/LinkPost";
export default {
  name: "LinksPage",
  components: {
    Loader,
    LinkPost
  },
  props: ["private"],
  computed: {
    links() {
      return this.$store.state.profile.links.links;
    },
    loading() {
      return this.$store.state.profile.links.loading;
    },
    error() {
      return this.$store.state.profile.links.error;
    },
    isEditMode() {
      return this.$store.state.profile.links.editedLink;
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
    },
    deleteHandler(link) {
      this.$store.dispatch("profile/links/deleteLink", link.id);
    }
  },
  mounted() {
    this.$store.dispatch("profile/links/clearLinks");
    this.fetchLinks();
  }
};
</script>
