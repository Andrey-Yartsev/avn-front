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
                    class="form-title table-header-title table-header-title_sticky bg-gradient tableHeader"
                  >
                    <!-- <div
                    class="form-title table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
                  > -->
                    <!-- <div class="bg-gradient__shadow bg-gradient__shadow_mob"> -->
                    <div class="">
                      <div class="inner" v-if="$mq === 'desktop'">
                        <span class="semi-transparent nowrap-text"
                          >Earnings</span
                        >
                      </div>
                      <div v-if="$mq == 'mobile'" class="filtersSection">
                        <label
                          >Sort by spend period:
                          <select v-model="selectedFilter">
                            <option value="day">Today</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="lifetime">Lifetime</option>
                          </select>
                        </label>
                        <label
                          >Order by spend amount:
                          <select
                            :value="orderSelectValue"
                            @change="orderChangeHandler"
                          >
                            <option value="ASC">Low to high</option>
                            <option value="DESC">High to low</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <div class="table-header" v-if="$mq === 'desktop'">
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
                        class="spend table__cell table__cell_align table__cell_align-hor-c headerTitle"
                        @click="switchSpendOrder('day')"
                      >
                        Spend<br />today
                        <span
                          class="arr-inverse icn-item"
                          :class="{ 'arr-reverse': this.sort.day === 'ASC' }"
                        ></span>
                      </div>
                      <div
                        class="spend table__cell table__cell_align table__cell_align-hor-c headerTitle"
                        @click="switchSpendOrder('week')"
                      >
                        Spend by<br />week
                        <span
                          class="arr-inverse icn-item"
                          :class="{ 'arr-reverse': this.sort.week === 'ASC' }"
                        ></span>
                      </div>
                      <div
                        class="spend table__cell table__cell_align table__cell_align-hor-c headerTitle"
                        @click="switchSpendOrder('month')"
                      >
                        Spend by<br />month
                        <span
                          class="arr-inverse icn-item"
                          :class="{ 'arr-reverse': this.sort.month === 'ASC' }"
                        ></span>
                      </div>
                      <div
                        class="spend table__cell table__cell_align table__cell_align-hor-c headerTitle"
                        @click="switchSpendOrder('lifetime')"
                      >
                        Spend<br />lifetime
                        <span
                          class="arr-inverse icn-item"
                          :class="{
                            'arr-reverse': this.sort.lifetime === 'ASC'
                          }"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="shadow-block no-padding"
                    :class="{ 'table-empty': users.length === 0 }"
                  >
                    <div class="table-wrapper">
                      <UsersTable
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
import UsersTable from "@/components/users/UsersTable.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import BackRouter from "@/utils/backRouter";

export default {
  name: "Earnings",
  mixins: [InfinityScrollMixin, UserMixin],
  components: {
    Loader,
    UsersTable,
    ProfileAvatar,
    ProfileBackground,
    ProfileActions,
    Footer
  },

  data: () => ({
    loadingName: "earningsRequestLoading",
    filter: "",
    actionPrefix: "earnings",
    sort: {
      day: "DESC",
      week: "DESC",
      month: "DESC",
      lifetime: "DESC"
    },
    selectedFilter: "lifetime"
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
    },
    orderSelectValue() {
      return this.sort[this.selectedFilter];
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
        sort: this.sort[this.selectedFilter],
        sortBy: this.selectedFilter
      });
    },
    goBack() {
      BackRouter.back();
    },
    switchSpendOrder(type) {
      this.setSelectedFilter(type);
      this.sort[type] = this.sort[type] === "ASC" ? "DESC" : "ASC";
    },
    setSelectedFilter(type) {
      this.selectedFilter = type;
    },
    orderChangeHandler(e) {
      this.sort[this.selectedFilter] = e.target.value;
    },
    filterChangeHandler(e) {
      this.selectedFilter = e.target.value;
    }
  },
  watch: {
    page() {
      this.init();
    },
    sort: {
      handler() {
        this.init();
      },
      deep: true
    },
    selectedFilter() {
      if (this.$mq === "mobile") {
        this.init();
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.headerTitle {
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgb(231, 231, 231);
  }
}
.tableHeader {
  padding-bottom: 19px;
}
</style>
