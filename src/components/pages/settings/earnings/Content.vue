<template>
  <div class="rounded-container">
    <div class="EarningsBlockCollectionView settings-wrapper">
      <h1 class="form-title settings-title">
        Earnings
      </h1>
      <div
        class="form-title table-header-title table-header-title_sticky bg-gradient border-bottom"
      >
        <div v-if="$mq == 'mobile'" class="filtersSection">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">
                Sort by spend period:
              </span>
              <span class="select-wrapper">
                <select v-model="selectedFilter">
                  <option value="day">Today</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">
                Order by spend amount:
              </span>
              <span class="select-wrapper">
                <select :value="orderSelectValue" @change="orderChangeHandler">
                  <option value="ASC">Low to high</option>
                  <option value="DESC">High to low</option>
                </select>
              </span>
            </label>
          </div>
        </div>
        <div class="table-header m-reset-tgap" v-if="$mq === 'desktop'">
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
          <div class="border-top loader-container" v-if="!allDataRecieved">
            <Loader :fullscreen="false" text="" :small="true" />
          </div>
          <div v-if="users.length" ref="scrollObserver"></div>
          <div
            v-if="!users.length && allDataRecieved"
            class="empty-table-info show"
          >
            <span>Empty here for now</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import UserMixin from "@/mixins/user";
import UsersTable from "@/components/users/UsersTable.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import BackRouter from "@/utils/backRouter";
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "Earnings",
  mixins: [UserMixin, IntersectionObserver],
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
    selectedFilter: "lifetime",
    fetchLimit: 15
  }),
  computed: {
    loading() {
      return this.$store.state.earnings.earningsRequestLoading;
    },
    allDataRecieved() {
      return this.$store.state.earnings.allDataReceived;
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
    listLength() {
      return this.users.length;
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
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("earnings/reset");
      this.getPosts();
    },
    getPosts() {
      this.$store
        .dispatch("earnings/getPosts", {
          type: this.actionPrefix,
          sort: this.sort[this.selectedFilter],
          sortBy: this.selectedFilter
        })
        .then(() => {
          this.isInitFetch = false;
          this.handleResponseWithIntersectionObserver(this.getPosts);
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
  mounted() {
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
