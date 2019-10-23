<template>
  <div class="loader-container loader-container_center" v-if="!profile">
    <Loader :fullscreen="false" text="" :small="true" />
  </div>
  <div class="special-container" v-else>
    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      to="/addPost"
      v-if="isAuth() && $mq === 'mobile'"
    />
    <div class="white-bg-block">
      <ProfileBackground :profile="profile" v-if="$mq === 'desktop'" />
      <div class="profile-images" v-if="$mq === 'desktop'">
        <ProfileAvatar :profile="profile" :pageName="page" />
      </div>
      <div
        class="post-types-tabs"
        :style="{
          'margin-right': `${-scrollBarWidth}px`,
          'padding-right': `${scrollBarWidth}px`
        }"
      >
        <div class="container">
          <ProfileActions :profile="profile" :page="page" />
        </div>
      </div>
      <div class="content-wrapper">
        <div class="container">
          <div class="content-nav hidden-mobile" v-if="$mq === 'desktop'">
            <router-link to="/following" class="content-nav__item"
              >Following {{ profile.followingCount }}</router-link
            >
            <router-link to="/followers" class="content-nav__item"
              >Followers {{ profile.followersCount }}</router-link
            >
            <router-link
              to="/likes"
              class="content-nav__item"
              v-if="isOwner(profile.id)"
            >
              Likes {{ profile.favoritesCount }}
            </router-link>
            <router-link
              to="/subscribers"
              class="content-nav__item"
              v-if="isOwner(profile.id)"
            >
              Subscribers
            </router-link>
          </div>
          <div
            class="sticky-header-controls header-mobile"
            v-if="$mq === 'mobile'"
          >
            <a
              class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
              :href="`/`"
              @click.prevent="goBack"
            />
            <h1 class="page-title">Subscribers</h1>
          </div>
          <div
            class="subscribers-filters"
            :class="{ 'shadow-block': $mq === 'mobile' }"
          >
            <div class="form-group checkbox-group item">
              <label
                class="form-group-inner"
                :class="{ 'form-group-inner_inline': $mq === 'desktop' }"
              >
                <div class="checkbox-wrapper">
                  <input type="checkbox" v-model="isSnapchatOnly" />
                  <span class="label icn-item">Snapchat</span>
                </div>
              </label>
              <label
                class="form-group-inner"
                :class="{ 'form-group-inner_inline': $mq === 'desktop' }"
              >
                <div class="checkbox-wrapper">
                  <input type="checkbox" v-model="isActiveOnly" />
                  <span class="label icn-item">Active</span>
                </div>
              </label>
              <label
                class="form-group-inner"
                :class="{ 'form-group-inner_inline': $mq === 'desktop' }"
              >
                <div class="checkbox-wrapper">
                  <input type="checkbox" v-model="isExpiredOnly" />
                  <span class="label icn-item">Expired</span>
                </div>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="content-col single-col">
              <div class="rounded-container">
                <div class="SubscribersBlockCollectionView settings-wrapper">
                  <div
                    class="form-title table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
                  >
                    <div class="bg-gradient__shadow bg-gradient__shadow_mob">
                      <div class="inner">
                        <span class="semi-transparent nowrap-text"
                          >Subscribers</span
                        >
                        <!-- <form class="referrals-search b-search-form">
                          <input
                            type="text"
                            class="rounded sm"
                            placeholder="Search"
                            v-model="filter"
                          />
                          <button
                            type="submit"
                            disabled=""
                            class="b-search-form__btn icn-item"
                          ></button>
                        </form> -->
                      </div>
                    </div>
                    <div class="table-header referrals-table-header">
                      <div class="user table__cell">
                        User
                      </div>
                      <div class="snapchatUsername table__cell">
                        Snapchat<br />Username
                      </div>
                      <!-- <div
                        class="amount table__cell table__cell_align table__cell_align-hor-c table__cell_selected"
                        :class="{ reverse: !this.desc }"
                        @click="switchAmountOrder"
                      > -->
                      <div
                        class="amount table__cell table__cell_align table__cell_align-hor-c table__cell_selected"
                      >
                        Amount
                      </div>
                      <div
                        class="status table__cell table__cell_align table__cell_align-hor-c"
                      >
                        Status
                      </div>
                      <div
                        class="joined table__cell table__cell_align table__cell_align-hor-c"
                      >
                        Joined
                      </div>
                      <div
                        class="canceled table__cell table__cell_align table__cell_align-hor-c"
                      >
                        Canceled
                      </div>
                    </div>
                  </div>
                  <div
                    class="shadow-block no-padding"
                    :class="{ 'table-empty': users.length === 0 }"
                  >
                    <div class="table-wrapper">
                      <Users
                        v-if="users.length"
                        :items="users"
                        :loading="false"
                        :query="page"
                        :actionPrefix="actionPrefix"
                      />
                      <div class="loader-infinity" v-if="infinityScrollLoading">
                        <Loader
                          :fullscreen="false"
                          :inline="true"
                          class="small"
                        />
                      </div>
                      <div class="empty-table-info">
                        <span>Empty here for now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import Users from "@/components/users/Users.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import UserDropdown from "@/components/common/userDropdown/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import BackRouter from "@/router/backRouter";

export default {
  name: "Subscribers",
  mixins: [InfinityScrollMixin, UserMixin],
  components: {
    Loader,
    Users,
    SubscribeButton,
    ProfileAvatar,
    HeaderControl,
    ProfileBackground,
    FollowersCounter,
    UserDropdown,
    ProfileActions,
    Footer
  },

  data: () => ({
    loadingName: "subscribesRequestLoading",
    filter: "",
    actionPrefix: "subscribes",
    isSnapchatOnly: false,
    isActiveOnly: false,
    isExpiredOnly: false
  }),
  computed: {
    loading() {
      return this.$store.state.subscribes.subscribesRequestLoading;
    },
    page() {
      return this.$route.meta.title;
    },
    profile() {
      return this.user;
    },
    users() {
      const isGay = !!window.location.hostname.match(/gayvn/);
      if (isGay) {
        const excepting = ["avnawards", "avnmagazine"];
        return this.$store.state.subscribes.posts.filter(user => {
          return excepting.indexOf(user.username) === -1;
        });
      }
      return this.$store.state.subscribes.posts;
    },
    store() {
      return this.$store.state.subscribes;
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    }
  },
  methods: {
    init() {
      this.resetInfinityScroll();
      this.$store.commit("subscribes/reset");
      this.getPosts();
    },
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
    },
    getPosts() {
      this.$store.dispatch("subscribes/getPosts", {
        type: this.actionPrefix,
        active: this.isActiveUsers()
      });
    },
    isActiveUsers() {
      if (
        (this.isActiveOnly && this.isExpiredOnly) ||
        (!this.isActiveOnly && !this.isExpiredOnly)
      )
        return "";
      if (this.isActiveOnly) return true;
      if (this.isExpiredOnly) return false;
    },
    openGroupMessageModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMessage"
      });
    },
    changeActionPreffix(value) {
      // console.log(value)
      this.actionPrefix = value;
      this.$nextTick(() => {
        this.init();
      });
    },
    goBack() {
      BackRouter.back();
    }
  },
  watch: {
    page() {
      this.init();
    },
    isSnapchatOnly(newValue) {
      if (newValue) {
        this.changeActionPreffix("snapchat");
      } else {
        this.changeActionPreffix("subscribes");
      }
    },
    isActiveOnly() {
      this.init();
    },
    isExpiredOnly() {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.messages-controllers {
  .title {
    text-align: center;
    font-weight: bold;
  }
  .group-messages-buttons {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-evenly;
    padding: 1rem;
    .message-button {
      border: 1px solid rgba(128, 128, 128, 0.295);
      padding: 0.5rem 2rem;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background-color: rgba(128, 128, 128, 0.295);
      }
    }
  }
}
</style>