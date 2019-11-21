<template>
  <div
    class="linksPage links-content"
    :class="{ 'links-content_filled': !loading && media.length }"
  >
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <div v-if="media.length" class="links-wrapper">
        <MediaPost
          v-for="item in media"
          :media="item"
          :key="item.id"
          @edit="editHandler(item)"
        />
      </div>
      <FileUploader />
      <template v-if="!loading && !media.length">
        <p class="empty-feed">
          <span>Nothing here yet</span>
        </p>
      </template>
      <!-- <div class="links-add-new" v-if="this.$props.private">
        <button
          class="make-post-btn make-post-btn_feed make-post-btn_color-sec btn-with-icon btn-with-icon_lg"
          @click="openAddMediaModal"
        >
          <span class="icn-item icn-camera"></span>
          Add new video
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import MediaPost from "@/components/addMedia/MediaPost";
import FileUploader from "@/components/common/profile/media/FileUploader";
export default {
  name: "MediaPage",
  components: {
    Loader,
    MediaPost,
    FileUploader
  },
  props: ["private"],
  computed: {
    media() {
      return this.$store.state.profile.media.media;
    },
    loading() {
      return this.$store.state.profile.media.getMediaLoading;
    }
  },
  methods: {
    openAddMediaModal() {
      this.$store.dispatch("modal/show", {
        name: "addMedia"
      });
    },
    fetchMedia() {
      this.$store.dispatch(
        "profile/media/getMedia",
        this.$store.state.profile.home.profile.id
      );
    },
    editHandler(item) {
      this.$store.commit("profile/media/startEditMedia", item);
      this.$store.dispatch("modal/show", {
        name: "addMedia"
      });
    }
  },
  mounted() {
    this.fetchMedia();
  }
};
</script>

<style scoped>
.addLink__button {
  margin-top: 3rem;
}
</style>
