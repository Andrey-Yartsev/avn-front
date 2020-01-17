<template>
  <div>
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <template v-if="this.$props.private && storeEnabled">
        <template v-if="this.user.isPerformer">
          <FileUploader
            :defaultLimits="limits"
            :disableWatermark="withoutWatermark"
            @setFilesLength="setFilesLength"
          />
        </template>
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
        v-if="media.length"
        :class="['buttonWrapper', 'more-functions', { open: opened }]"
        v-click-outside="hide"
      >
        <div
          class="b-check-state  b-check-state_watermark watermarkContainer"
          :class="{ mediaSelected: isFilesLoaded }"
          v-if="
            this.$props.private &&
              user &&
              user.isPerformer &&
              user.hasWatermarkVideo
          "
        >
          <label :class="{ disabled: isFilesLoaded }">
            <input
              class="is-free-post"
              type="checkbox"
              :disabled="isFilesLoaded"
              v-model="withoutWatermark"
            />
            <span class="b-check-state__icon icn-item icn-size_lg"></span>
            <span class="b-check-state__text">Without watermark</span>
          </label>
        </div>
        <div class="more-functions__overlay" @click="hide"></div>
        <div class="sortLabel">Sort:</div>
        <div class="openMenuButton" @click="open" style="color: red">
          <img
            v-if="filterType"
            :src="'/static/img/ic-filter-red.svg'"
            alt="filter"
          />
          <img v-else :src="'/static/img/ic-filter.svg'" alt="filter" />
        </div>
        <div class="more-functions__dropdown">
          <FilterDropdown
            :isAuthor="this.$props.private"
            :type="filterType"
            @handleClick="handleClick"
          />
        </div>
      </div>
      <template v-else>
        <div
          class="b-check-state  b-check-state_watermark watermarkContainer"
          :class="{ mediaSelected: isFilesLoaded }"
          v-if="
            this.$props.private &&
              user &&
              user.isPerformer &&
              user.hasWatermarkVideo
          "
        >
          <label :class="{ disabled: isFilesLoaded }">
            <input
              class="is-free-post"
              type="checkbox"
              :disabled="isFilesLoaded"
              v-model="withoutWatermark"
            />
            <span class="b-check-state__icon icn-item icn-size_lg"></span>
            <span class="b-check-state__text">Without watermark</span>
          </label>
        </div>
      </template>
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
      <div class="border-top loader-container" v-if="!allDataRecieved">
        <Loader :fullscreen="false" text="" :small="true" />
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
import FilterDropdown from "@/components/common/profile/media/edit/FilterDropdown";
import User from "@/mixins/user";
import IntersectionObserver from "@/mixins/intersectionObserver";
import ClickOutside from "vue-click-outside";

export default {
  name: "MediaPage",
  components: {
    Loader,
    FileUploader,
    FilterDropdown
  },
  directives: {
    ClickOutside
  },
  props: ["private"],
  mixins: [User, IntersectionObserver],
  data() {
    return {
      limits: {
        video: 10,
        gif: 0,
        photo: 0
      },
      filterType: "",
      opened: false,
      fetchLimit: 9,
      withoutWatermark: false,
      filesLength: 0
    };
  },
  computed: {
    media() {
      return this.$store.state.profile.media.media;
    },
    listLength() {
      return this.media.length;
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
    },
    getSortOrder() {
      switch (this.filterType) {
        case "dateNew":
        case "priceHight":
          return "DESC";
        case "dateOld":
        case "priceLow":
          return "ASC";
        default:
          return null;
      }
    },
    getFilterType() {
      if (this.filterType === "dateNew" || this.filterType === "dateOld") {
        return "date";
      }
      if (this.filterType === "priceHight" || this.filterType === "priceLow") {
        return "price";
      }
      return this.filterType;
    },
    isFilesLoaded() {
      return this.filesLength > 0;
    }
  },
  watch: {
    filterType() {
      this.$store.commit("profile/media/clearMedia", null, { root: true });
      this.fetchMedia();
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
    },
    handleClick(type) {
      this.opened = false;
      this.filterType = type;
    },
    fetchMedia() {
      this.$store
        .dispatch("profile/media/getMedia", {
          profileId: this.$store.state.profile.home.profile.id,
          filter: this.getFilterType,
          sort: this.getSortOrder
        })
        .then(() => {
          this.handleResponseWithIntersectionObserver(this.fetchMedia);
        });
    },
    setFilesLength(value) {
      this.filesLength = value;
    }
  },
  mounted() {
    this.$store.commit("profile/media/clearMedia", null, { root: true });
    this.fetchMedia();
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
  &__button {
    cursor: pointer;
    padding: 5px;
    border-radius: 3px;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: rgba(190, 186, 186, 0.377);
    }
  }
}
.buttonWrapper {
  display: flex !important;
  justify-content: flex-end;
  margin: 5px 0px;
}
.openMenuButton {
  display: inline-block;
  margin: 5px 0;
  margin-right: 20px;
  cursor: pointer;
}
.sortLabel {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
  color: #909598;
}
.watermarkContainer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-right: auto;
  margin-left: 10px;
}
</style>
