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
            <router-link
              to="/earnings"
              class="content-nav__item"
              v-if="isOwner(profile.id) && profile.canEarn"
            >
              Earnings
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
            <h1 class="page-title">Earnings</h1>
          </div>
          <div class="row">
            <div class="content-col single-col">
              <div class="rounded-container">
                <div class="EarningsBlockCollectionView settings-wrapper">
                  <div
                    class="form-title table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
                  >
                    <div class="bg-gradient__shadow bg-gradient__shadow_mob">
                      <div class="inner">
                        <span class="semi-transparent nowrap-text"
                          >Earnings</span
                        >
                      </div>
                    </div>
                    <div class="table-header">
                      <div class="index table__cell">
                        №
                      </div>
                      <div class="user table__cell">
                        Name
                      </div>
                      <div
                        class="signed table__cell table__cell_align table__cell_align-hor-c"
                      >
                        Payed since
                      </div>
                      <div
                        class="spend table__cell table__cell_align table__cell_align-hor-c"
                        @click="switchSpendOrder"
                      >
                        Spend lifetime
                        <span
                          class="arr-inverse icn-item"
                          :class="{ 'arr-reverse': this.sort === 'ASC' }"
                        ></span>
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
import Users from "@/components/users/Users.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import BackRouter from "@/router/backRouter";

export default {
  name: "Earnings",
  mixins: [InfinityScrollMixin, UserMixin],
  components: {
    Loader,
    Users,
    ProfileAvatar,
    ProfileBackground,
    ProfileActions,
    Footer
  },

  data: () => ({
    loadingName: "earningsRequestLoading",
    filter: "",
    actionPrefix: "earnings",
    sort: "DESC"
  }),
  computed: {
    loading() {
      return this.$store.state.earnings.earningsRequestLoading;
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
        return this.$store.state.earnings.posts.filter(user => {
          return excepting.indexOf(user.username) === -1;
        });
      }
      return this.$store.state.earnings.posts;
    },
    store() {
      return this.$store.state.earnings;
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
      this.$store.commit("earnings/reset");
      this.getPosts();
    },
    infinityScrollGetDataMethod() {
      if (this.profile) {
        this.getPosts();
      }
    },
    getPosts() {
      this.$store.dispatch("earnings/getPosts", {
        type: this.actionPrefix,
        sort: this.sort
      });
    },
    goBack() {
      BackRouter.back();
    },
    switchSpendOrder() {
      this.sort = this.sort === "ASC" ? "DESC" : "ASC";
    }
  },
  watch: {
    page() {
      this.init();
    },
    sort() {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
