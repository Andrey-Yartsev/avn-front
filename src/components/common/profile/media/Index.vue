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
        class="b-check-state  b-check-state_watermark watermarkContainer"
        :class="{ mediaSelected: isFilesLoaded, mobile: $mq === 'mobile' }"
        v-if="this.$props.private && user && user.isPerformer"
      >
        <label
          v-if="user.hasWatermarkVideo"
          :class="{ disabled: isFilesLoaded }"
        >
          <input
            class="is-free-post"
            type="checkbox"
            :disabled="isFilesLoaded"
            v-model="withoutWatermark"
          />
          <span class="b-check-state__icon icn-item icn-size_lg"></span>
          <span class="b-check-state__text">Without watermark</span>
        </label>
        <button
          @click="generateAccessLink"
          type="button"
          class="btn btn_reset-mgap alt border "
        >
          Free access link
        </button>
      </div>
      <div class="viewSettings" :class="{ mobile: $mq === 'mobile' }">
        <div
          class="form-group categories"
          :class="{ mobile: $mq === 'mobile' }"
        >
          <div class="form-group-inner">
            <span class="label">Categories:</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <multiselect
                  v-model="selectedCategory"
                  :options="categoriesList"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select category"
                  label="title"
                  track-by="name"
                  :taggable="false"
                  :openDirection="$mq === 'desktop' ? 'bottom' : ''"
                >
                </multiselect>
              </span>
            </span>
          </div>
        </div>
        <div
          :class="['buttonWrapper', 'more-functions', { open: opened }]"
          v-click-outside="hide"
        >
          <div class="more-functions__overlay" @click="hide"></div>
          <div class="sortLabel">Sort:</div>
          <div class="openMenuButton" @click="open">
            <span class="status-card on icn-item checkmark styledCheckmark" />
            <span class="filterLabel">{{ getFilterName }}</span>
          </div>
          <div class="more-functions__dropdown">
            <FilterDropdown
              :isAuthor="this.$props.private"
              :type="filterType"
              @handleClick="handleClick"
            />
          </div>
        </div>
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
import Multiselect from "vue-multiselect";

const defaultSelectedCategory = { id: "0", name: "All", title: "All" };

export default {
  name: "MediaPage",
  components: {
    Loader,
    FileUploader,
    FilterDropdown,
    Multiselect
  },
  directives: {
    ClickOutside
  },
  props: ["private"],
  mixins: [User, IntersectionObserver],
  data() {
    return {
      limits: {
        video: 100,
        gif: 0,
        photo: 0,
        audio: 10
      },
      filterType: "all",
      opened: false,
      fetchLimit: 9,
      withoutWatermark: false,
      filesLength: 0,
      selectedCategory: defaultSelectedCategory
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
    },
    getFilterName() {
      switch (this.filterType) {
        case "all":
          return "All";
        case "sale":
          return "On sale";
        case "draft":
          return "Draft";
        case "dateNew":
          return "Newest";
        case "dateOld":
          return "Oldest";
        case "priceHight":
          return "Price: Hight to Low";
        case "priceLow":
          return "Price: Low to High";
        default:
          return "all";
      }
    },
    categoriesList() {
      if (!this.$store.state.profile.home.profile.mediaCategories) {
        return [];
      }
      let list = this.$store.state.profile.home.profile.mediaCategories.map(
        item => {
          const transformedName = item.name.replace(/&amp;/g, "&");
          return {
            id: item.id,
            name: transformedName,
            amount: item.amount,
            title: `${transformedName} (${item.amount})`
          };
        }
      );
      list.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
      list.unshift({ id: "0", name: "All", title: "All" });
      return list;
    }
  },
  watch: {
    filterType() {
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("profile/media/clearMedia", null, { root: true });
      this.fetchMedia();
    },
    selectedCategory(newValue) {
      if (!newValue) {
        this.selectedCategory = defaultSelectedCategory;
        return;
      }
      this.destroyObserver();
      this.isInitFetch = true;
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
          categories: this.selectedCategory.id,
          profileId: this.$store.state.profile.home.profile.id,
          filter: this.getFilterType,
          sort: this.getSortOrder
        })
        .then(() => {
          this.isInitFetch = false;
          this.handleResponseWithIntersectionObserver(this.fetchMedia);
        });
    },
    setFilesLength(value) {
      this.filesLength = value;
    },
    generateAccessLink() {
      this.$store
        .dispatch("profile/media/generateFullAccessLink", null, {
          root: true
        })
        .then(res => {
          const urlString = `${window.location.origin}/${
            this.$store.state.auth.user.username
          }/media/${res}`;
          this.$store.dispatch("modal/show", {
            name: "mediaAccessLink",
            data: {
              text:
                "Share this one-off link to give free access to all your curently available clips",
              linkUrl: urlString
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.$store.dispatch("profile/media/getMediaCategories", null, {
      root: true
    });
    this.$store.commit("profile/media/clearMedia", null, { root: true });
    this.fetchMedia();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
  margin-bottom: 8px;
  margin-left: 5px;
}
.openMenuButton {
  display: block;
  /* display: inline-block; */
  margin: 5px 0;
  margin-right: 7px;
  cursor: pointer;
}
.sortLabel {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-weight: 500;
  color: #909598;
}
.watermarkContainer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  button {
    margin-left: auto;
    line-height: 15px;
  }
  &.mobile {
    margin-left: 10px;
    button {
      margin-right: 10px;
    }
  }
}
.styledCheckmark {
  position: relative;
  font-size: 23px;
  line-height: 16px;
}
.filterLabel {
  font-weight: bold;
  color: #909598;
}
.categories {
  flex-grow: 1;
  max-width: 350px;
  &.mobile {
    padding: 0;
    margin-bottom: 7px;
    max-width: 300px;
    .form-group-inner {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 0;
      .label {
        padding-bottom: 0;
      }
    }
  }
}
.viewSettings {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  &.mobile {
    margin: 10px 8px 0 8px;
    flex-flow: column nowrap;
    align-items: normal;
    .buttonWrapper {
      justify-content: flex-start;
    }
  }
  .form-group-inner {
    .label {
      color: #909598;
      font-size: 15px;
    }
  }
}
</style>
