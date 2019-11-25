<template>
  <div>
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <FileUploader :defaultLimits="limits" v-if="this.$props.private" />
      <div class="profile-content">
        <div class="exploreAllCollectionView">
          <div class="explore">
            <div class="explore__inside">
              <div class="explore-wrapper videos">
                <component
                  :is="postComponent"
                  v-for="post in media"
                  :post="post"
                  :key="post.id"
                  from="profile/home"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="media.length" ref="scrollObserver"></div>
      <template v-if="!loading && !media.length">
        <p class="empty-feed">
          <span>Nothing here yet</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import MediaPost from "@/components/addMedia/MediaPost";
import FileUploader from "@/components/common/profile/media/FileUploader";
import PostCollection from "@/components/post/collection/Index";
import MediaSmall from "@/components/common/profile/media/views/MediaSmall";
import MediaMedium from "@/components/common/profile/media/views/MediaMedium";

export default {
  name: "MediaPage",
  components: {
    Loader,
    MediaPost,
    FileUploader,
    PostCollection
  },
  props: ["private"],
  data() {
    return {
      limits: {
        video: 3,
        gif: 3,
        photo: 3
      },
      observer: null
    };
  },
  computed: {
    media() {
      return this.$store.state.profile.media.media;
    },
    loading() {
      return this.$store.state.profile.media.getMediaLoading;
    },
    postComponent() {
      if (this.$mq === "mobile") {
        return MediaMedium;
      }
      return MediaSmall;
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
    },
    inintIntersectionObserver() {
      const callback = entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("load more");
          }
        });
      };
      this.observer = new IntersectionObserver(callback);
      const target = this.$refs.scrollObserver;
      if (target) {
        this.observer.observe(target);
      }
    }
  },
  mounted() {
    console.log(this.media);
    // this.fetchMedia();
    this.inintIntersectionObserver();
  },
  beforeDestroy() {
    const target = this.$refs.scrollObserver;
    if (target) {
      this.observer.unobserve(target);
    }
  }
};
</script>

<style scoped>
.addLink__button {
  margin-top: 3rem;
}
</style>
