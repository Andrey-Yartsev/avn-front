<template>
  <div class="usersGroups">
    <div v-if="loading" class="loader-infinity">
      <Loader :fullscreen="false" :inline="true" :small="true" />
    </div>
    <div v-else class="content">
      <div
        v-if="isPrivate"
        class="viewSettings"
        :class="{ mobile: $mq === 'mobile' }"
      >
        <button
          type="button"
          @click="newGroupHandler"
          class="btn btn_reset-mgap alt border btn_fix-width-md connect-twitter"
        >
          + New group
        </button>
        <div
          :class="['buttonWrapper', 'more-functions', { open: opened }]"
          v-click-outside="hide"
        >
          <div class="more-functions__overlay" @click="hide"></div>
          <div class="sortLabel">Filter:</div>
          <div class="openMenuButton" @click="open">
            <span class="filterLabel">{{ getFilterName }}</span>
          </div>
          <div class="more-functions__dropdown">
            <FilterDropdown
              :isAuthor="isPrivate"
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
              <div class="explore-wrapper groups">
                <component
                  :is="groupComponent"
                  v-for="item in groups"
                  :group="item"
                  :key="item.id"
                  from="profile/home"
                  :isPrivate="isPrivate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-top loader-container" v-if="!allDataRecieved">
        <Loader :fullscreen="false" text="" :small="true" />
      </div>
      <div v-if="groups.length" ref="scrollObserver"></div>
      <template v-if="!loading && !groups.length">
        <p class="empty-feed">
          <span>Nothing here yet</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";
import GroupItem from "./views/GroupItem";
import FilterDropdown from "./parts/FilterDropdown";
import IntersectionObserver from "@/mixins/intersectionObserver";
import ClickOutside from "vue-click-outside";

export default {
  name: "GroupsPage",
  components: {
    Loader,
    GroupItem,
    FilterDropdown
  },
  directives: {
    ClickOutside
  },
  props: ["isPrivate"],
  mixins: [User, IntersectionObserver],
  data() {
    return {
      fetchLimit: 9,
      opened: false,
      filterType: "all"
    };
  },
  computed: {
    groups() {
      return this.$store.state.profile.groups.groups;
    },
    loading() {
      return this.$store.state.profile.groups.getListsLoading;
    },
    allDataRecieved() {
      return this.$store.state.profile.groups.allDataReceived;
    },
    getFilterName() {
      const str = this.filterType;
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    groupComponent() {
      return GroupItem;
    }
  },
  watch: {
    filterType() {
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("profile/groups/clearGroups", null, { root: true });
      this.fetchData();
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
    fetchData() {
      this.$store
        .dispatch("profile/groups/getGroups", {
          profileId: this.$store.state.profile.home.profile.id,
          filter: this.filterType
        })
        .then(() => {
          this.isInitFetch = false;
          this.handleResponseWithIntersectionObserver(this.fetchData);
        });
    },
    newGroupHandler() {
      this.$store.dispatch("modal/show", {
        name: "addGroup"
      });
    }
  },
  mounted() {
    // this.$store.commit("profile/groups/clearGroups", null, { root: true });
    // this.fetchData();
  }
};
</script>
