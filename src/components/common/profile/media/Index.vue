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
                  :is="mediaComponent"
                  v-for="item in media"
                  :post="item"
                  :key="item.id"
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
import FileUploader from "@/components/common/profile/media/FileUploader";
import MediaSmall from "@/components/common/profile/media/views/MediaSmall";
import MediaMedium from "@/components/common/profile/media/views/MediaMedium";

export default {
  name: "MediaPage",
  components: {
    Loader,
    FileUploader
  },
  props: ["private"],
  data() {
    return {
      limits: {
        video: 3,
        gif: 0,
        photo: 0
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
    mediaComponent() {
      if (this.$mq === "mobile") {
        return MediaMedium;
      }
      return MediaSmall;
    },
    allDataRecieved() {
      return this.$store.state.profile.media.allDataReceived;
    }
  },
  methods: {
    fetchMedia() {
      this.$store.dispatch(
        "profile/media/getMedia",
        this.$store.state.profile.home.profile.id
      );
    },
    inintIntersectionObserver() {
      const callback = entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            !this.allDataRecieved &&
            this.media.length > 10
          ) {
            console.log("load more");
            this.fetchMedia();
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
    this.fetchMedia();
    this.inintIntersectionObserver();
  },
  beforeDestroy() {
    const target = this.$refs.scrollObserver;
    if (target && this.observer) {
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
