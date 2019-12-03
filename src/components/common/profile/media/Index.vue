<template>
  <div>
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <template v-if="this.$props.private && storeEnabled">
        <FileUploader :defaultLimits="limits" v-if="this.user.isPerformer" />
        <div
          v-else
          class="form-title form-title__default-text border-top centered"
          style="text-align: center"
        >
          You need to enable <b>Earn money</b> option and
          <b>add a bank account</b> in
          <router-link to="/settings/profile" class="">Profile</router-link>
          settings
        </div>
      </template>
      <div
        v-if="this.$props.private && this.user.isPerformer"
        class="mediaFilter"
      >
        <span class="mediaFilter__label">Filter by: </span>
        <select v-model="filterType" name="type" class="mediaFilter__select">
          <option value="">All</option>
          <option value="sale">
            On Sale
          </option>
          <option value="draft">
            Draft
          </option>
        </select>
      </div>
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
                  :isPrivate="$props.private"
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
import User from "@/mixins/user";

export default {
  name: "MediaPage",
  components: {
    Loader,
    FileUploader
  },
  props: ["private"],
  mixins: [User],
  data() {
    return {
      limits: {
        video: 10,
        gif: 0,
        photo: 0
      },
      observer: null,
      filterType: ""
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
    },
    storeEnabled() {
      return this.$store.state.auth.user.storeEnabled;
    }
  },
  watch: {
    allDataRecieved(newValue) {
      if (newValue) {
        const target = this.$refs.scrollObserver;
        if (target && this.observer) {
          this.observer.unobserve(target);
        }
      }
    },
    filterType() {
      this.$store.commit("profile/media/clearMedia", null, { root: true });
      this.fetchMedia();
    }
  },
  methods: {
    fetchMedia() {
      this.$store
        .dispatch("profile/media/getMedia", {
          profileId: this.$store.state.profile.home.profile.id,
          filter: this.filterType
        })
        .then(() => {
          const target = this.$refs.scrollObserver;
          if (target && this.observer) {
            this.observer.unobserve(target);
          }
          this.initIntersectionObserver();
        });
    },
    initIntersectionObserver() {
      const callback = entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            !this.allDataRecieved &&
            this.media.length >= 9
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
    this.$store.commit("profile/media/clearMedia", null, { root: true });
    this.fetchMedia();
  },
  beforeDestroy() {
    const target = this.$refs.scrollObserver;
    if (target && this.observer) {
      this.observer.unobserve(target);
    }
  }
};
</script>

<style lang="scss" scoped>
.addLink__button {
  margin-top: 3rem;
}
.mediaFilter {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 0;
  &__label {
    font-weight: bold;
  }
  &__select {
    width: 30%;
    margin-left: 10px;
  }
}
</style>
