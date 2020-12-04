<template>
  <div>
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>

    <div v-else class="content">
      <div class="content-types">
        <a
          v-if="profile"
          class="btn-user-activity"
          :class="{ active: type === 'video' }"
          @click.prevent="changeType('video')"
          :href="`/${profile.username}/media/video`"
        >
          <span class="label"> Video </span>
        </a>
        <a
          v-if="profile"
          class="btn-user-activity"
          :class="{ active: type === 'photo' }"
          @click.prevent="changeType('photo')"
          :href="`/${profile.username}/media/photo`"
        >
          <span class="label"> Photo </span>
        </a>
        <a
          v-if="profile"
          class="btn-user-activity"
          :class="{ active: type === 'audio' }"
          @click.prevent="changeType('audio')"
          :href="`/${profile.username}/media/audio`"
        >
          <span class="label"> Audio </span>
        </a>
      </div>
      <template v-if="this.$props.private && storeEnabled">
        <template v-if="this.user.isPerformer">
          <FileUploader
            :defaultLimits="limits"
            :disableWatermark="withoutWatermark"
            :withDefaultCategory="withDefaultCategory"
            @setFilesLength="setFilesLength"
            :type="type"
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
          v-if="user.hasWatermarkVideo && this.type !== 'audio'"
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
        <label :class="{ disabled: isFilesLoaded }">
          <input
            class="is-free-post"
            type="checkbox"
            :disabled="isFilesLoaded"
            v-model="withDefaultCategory"
          />
          <span class="b-check-state__icon icn-item icn-size_lg"></span>
          <span class="b-check-state__text"
            >Set Default Category/Title based on filename</span
          >
        </label>
        <button
          @click="generateAccessLink"
          type="button"
          class="btn btn_reset-mgap alt border "
        >
          Free access link
        </button>
      </div>
      <div
        v-if="!purchasedFiltersOnly"
        class="viewSettings"
        :class="{ mobile: $mq === 'mobile' }"
      >
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
          v-if="this.$props.private && user && user.isPerformer"
          class="form-group categories viewOrder"
          :class="{ mobile: $mq === 'mobile' }"
        >
          <div class="form-group-inner">
            <span class="label">Default view order:</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <multiselect
                  v-model="mediaSortOrder[type]"
                  :options="viewOrderOptions"
                  @select="mediaSortOrderHandleChange"
                  :multiple="false"
                  :close-on-select="true"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select default order"
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
          class="viewModeIcon-container"
          v-if="this.$props.private && user && user.isPerformer"
        >
          <span
            class="icn-item icn-th viewModeIcon"
            :class="{ active: viewMode === 'grid' }"
            @click="setViewMode('grid')"
          ></span>
          <span
            class="icn-item icn-th-list viewModeIcon"
            :class="{ active: viewMode === 'list' }"
            @click="setViewMode('list')"
          ></span>
        </div>
        <div
          :class="['buttonWrapper', 'more-functions', { open: opened }]"
          v-click-outside="hide"
        >
          <div class="more-functions__overlay" @click="hide"></div>
          <div class="sortLabel">Sort / Filter:</div>
          <div class="openMenuButton" @click="open">
            <span class="status-card on icn-item checkmark styledCheckmark" />
            <span class="filterLabel">{{ getFilterDropdownLabel }}</span>
          </div>
          <div class="more-functions__dropdown">
            <FilterDropdown
              :isAuthor="this.$props.private"
              :filterType="filterType"
              :sortType="sortType"
              :orderType="orderType"
              :isListView="viewMode === 'list'"
              @handleClick="handleClick"
            />
          </div>
        </div>
      </div>
      <div class="profile-content">
        <div class="exploreAllCollectionView">
          <div class="explore">
            <div class="explore__inside">
              <div
                class="explore-wrapper videos"
                :class="{ listViewItem: viewMode === 'list' }"
              >
                <MediaListTable
                  v-if="viewMode === 'list'"
                  :items="media"
                  @filterClickHandler="filterClickHandler"
                />
                <template v-else>
                  <component
                    :is="mediaComponent"
                    v-for="item in media"
                    :post="item"
                    :key="item.id"
                    from="profile/home"
                    :isPrivate="$props.private"
                  />
                </template>
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
import MediaListTable from "@/components/common/profile/media/views/MediaListTable";
import FilterDropdown from "@/components/common/profile/media/edit/FilterDropdown";
import User from "@/mixins/user";
import IntersectionObserver from "@/mixins/intersectionObserver";
import ClickOutside from "vue-click-outside";
import Multiselect from "vue-multiselect";

const defaultSelectedCategory = { id: "0", name: "All", title: "All" };
const defaultViewOrderOptions = [
  { name: "default", title: "Default" },
  { name: "date", title: "Publish date" },
  { name: "totalRevenue", title: "Total revenue" },
  { name: "monthRevenue", title: "Month revenue" }
];

export default {
  name: "MediaPage",
  components: {
    Loader,
    FileUploader,
    FilterDropdown,
    Multiselect,
    MediaListTable
  },
  directives: {
    ClickOutside
  },
  props: {
    private: {
      type: Boolean
    },
    purchasedFiltersOnly: {
      type: Boolean,
      default: false
    }
  },
  mixins: [User, IntersectionObserver],
  data() {
    return {
      limits: {
        video: 100,
        gif: 0,
        photo: 50,
        audio: 10
      },
      filterType: this.purchasedFiltersOnly ? "purchases" : "",
      orderType: "DESC",
      sortType: "default",
      opened: false,
      fetchLimit: 9,
      withoutWatermark: false,
      withDefaultCategory: false,
      filesLength: 0,
      selectedCategory: defaultSelectedCategory,
      type: "video",
      viewMode: "grid",
      viewOrderOptions: [...defaultViewOrderOptions],
      mediaSortOrder: {
        video: { name: "default", title: "Default" },
        photo: { name: "default", title: "Default" },
        audio: { name: "default", title: "Default" }
      }
    };
  },
  computed: {
    media() {
      return this.$store.state.profile.media.media;
    },
    profile() {
      return this.$store.state.profile.home.profile;
    },
    listLength() {
      return this.media.length;
    },
    loading() {
      return this.$store.state.profile.media.getMediaLoading;
    },
    mediaComponent() {
      if (this.viewMode === "list") {
        return MediaListTable;
      }
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
    isFilesLoaded() {
      return this.filesLength > 0;
    },
    getFilterDropdownLabel() {
      if (this.sortType === "date") {
        return this.orderType === "ASC" ? "Oldest" : "Newest";
      }
      if (this.sortType === "price") {
        return this.orderType === "ASC"
          ? "Price: Low to High"
          : "Price: Hight to Low";
      }
      if (!this.filterType) {
        return "All";
      }
      if (this.filterType) {
        switch (this.filterType) {
          case "sale":
            return "On sale";
          case "draft":
            return "Draft";
          case "scheduled":
            return "Scheduled";
          case "purchases":
            return "My Purchases Only";
          default:
            return "All";
        }
      }
    },
    categoriesList() {
      if (!this.$store.state.profile.home.profile.mediaCategories[this.type]) {
        return [];
      }
      let list = this.$store.state.profile.home.profile.mediaCategories[
        this.type
      ].map(item => {
        const transformedName = item.name.replace(/&amp;/g, "&");
        return {
          id: item.id,
          name: transformedName,
          amount: item.amount,
          title: `${transformedName} (${item.amount})`
        };
      });
      list.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
      list.unshift({ id: "0", name: "All", title: "All" });
      return list;
    },
    getSortFilterLabel() {
      return this.private && this.viewMode === "list"
        ? "Filter"
        : "Sort / Filter";
    }
  },
  watch: {
    selectedCategory(newValue) {
      if (!newValue) {
        this.selectedCategory = defaultSelectedCategory;
        return;
      }
      this.resetAndFetch();
    },
    type(value) {
      this.selectedCategory = defaultSelectedCategory;
      (this.filterType = this.purchasedFiltersOnly ? "purchases" : ""),
        this.$store.dispatch(
          "profile/media/getMediaCategories",
          { type: value },
          {
            root: true
          }
        );
      this.resetAndFetch();
    }
  },
  methods: {
    resetAndFetch() {
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("profile/media/clearMedia", null, { root: true });
      this.fetchMedia();
    },
    open() {
      this.opened = true;
      this.$emit("openDropdown");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdown");
    },
    handleClick(data) {
      this.opened = false;
      const { filter, order, sort } = data;
      this.filterType = filter;
      this.sortType = sort;
      this.orderType = order;
      this.$nextTick(() => {
        this.resetAndFetch();
      });
    },
    filterClickHandler(data) {
      if (data === this.sortType) {
        this.orderType = this.orderType === "ASC" ? "DESC" : "ASC";
      } else {
        this.sortType = data;
      }
      this.$nextTick(() => {
        this.resetAndFetch();
      });
    },
    fetchMedia() {
      this.$store
        .dispatch("profile/media/getMedia", {
          categories: this.selectedCategory.id,
          profileId: this.$store.state.profile.home.profile.id,
          filter: this.filterType,
          sort: this.sortType,
          order: this.orderType,
          type: this.type
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
          }/media/${res.accessToken}`;
          this.$store.dispatch("modal/show", {
            name: "mediaAccessLink",
            data: {
              text:
                "Share this one-off link to give free access to all your currently available clips",
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
    },
    changeType(value) {
      this.type = value;
    },
    setViewCategory(value) {
      if (value) {
        const selectedOption = defaultViewOrderOptions.find(
          item => item.name === value
        );
        this.mediaSortOrder[value] = { ...selectedOption };
      }
      if (!value && this.user?.mediaSortOrder) {
        for (let key in this.user.mediaSortOrder) {
          const selectedOption = defaultViewOrderOptions.find(
            item => item.name === this.user.mediaSortOrder[key]
          );
          this.mediaSortOrder[key] = { ...selectedOption };
        }
      }
    },
    setViewMode(mode) {
      this.viewMode = mode;
    },
    mediaSortOrderHandleChange({ name }) {
      const updatedUser = {
        ...this.user,
        mediaSortOrder: {
          ...this.user.mediaSortOrder,
          [this.type]: name
        }
      };
      this.$store.dispatch("profile/update", updatedUser);
    }
  },
  mounted() {
    this.$store.dispatch(
      "profile/media/getMediaCategories",
      { type: this.type },
      {
        root: true
      }
    );
    this.$store.commit("profile/media/clearMedia", null, { root: true });
    this.fetchMedia();
    this.setViewCategory();
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
  label {
    margin-right: 10px;
  }
  &.mobile {
    margin-left: 10px;
    flex-wrap: wrap;
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
.viewOrder {
  .form-group-inner {
    .label {
      white-space: nowrap;
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
.content-types {
  margin: 0px 0 20px 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-evenly;
}
.btn-user-activity {
  .label {
    font-weight: 400;
  }
}
.viewModeIcon {
  margin: 0 5px;
  cursor: pointer;
  opacity: 0.5;
  &.active {
    opacity: 1;
  }
  &-container {
    margin-bottom: 8px;
  }
}
</style>
