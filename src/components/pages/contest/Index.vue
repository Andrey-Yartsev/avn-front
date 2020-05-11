<template>
  <div class="container contest">
    <Navigate />
    <div class="loader-container" v-if="loading">
      <Loader text="" :fullscreen="false" :small="true" />
    </div>
    <template v-else>
      <div class="awards-header">
        HEADER
      </div>
      <div class="awards-title text-centered">
        {{ contest.name }}
      </div>
      <template v-if="!sent">
        <div class="title-subtext text-centered">
          {{ contest.description }}<br />
          {{ periodText }}
        </div>
        <div class="explore-wrapper users">
          <Nominee
            v-for="v in nominees"
            :key="v.id"
            :props="v"
            :contestId="contestId"
          />
        </div>
      </template>
      <template v-else>
        <Share
          v-if="$store.state.awards.categories"
          :categories="_categories"
          :data="data || this.$store.state.awards.savedData.data"
          :modelUser="modelUser"
          :isGay="isGay"
          @complete="complete"
        />
      </template>
    </template>
  </div>
</template>

<script>
import Navigate from "@/components/pages/explore/navigate/Index";
import Footer from "@/components/footer/Index.vue";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";
import Nominee from "./Nominee";
import Share from "./Share";
import moment from "moment-timezone";

export default {
  name: "Contest",
  mixins: [User],
  components: {
    Navigate,
    Footer,
    Loader,
    Nominee,
    Share
  },
  data() {
    return {
      data: {},
      scriptLoading: true
    };
  },
  computed: {
    categories() {
      return [];
    },
    loading() {
      if (this.$store.state.contest.fetchContestsLoading) {
        return true;
      } else if (this.$store.state.contest.fetchNomineesLoading) {
        return true;
      }
      return false;
    },
    canSend() {
      return true;
    },
    sending() {
      return false;
    },
    sent() {
      return false;
    },
    successText() {
      return "Your voting have been sent successfully";
    },
    contestId() {
      return 1;
    },
    contests() {
      return this.$store.state.contest.fetchContestsResult;
    },
    contest() {
      return this.contests.find(v => v.id === this.contestId);
    },
    _nominees() {
      return this.$store.state.contest.fetchNomineesResult;
    },
    nominees() {
      return this._nominees.map((v, i) => {
        v.n = i + 1;
        return v;
      });
    },
    periodText() {
      const d1 = this.contest.starts_at.replace(/(.*)-\d+:\d+/, "$1");
      const m1 = moment(d1, this.contest.timezone);
      const d2 = this.contest.ends_at.replace(/(.*)-\d+:\d+/, "$1");
      const m2 = moment(d2, this.contest.timezone);
      const r1 = m1.local().format("MMM Do h:mm a");
      const r2 = m2.local().format("MMM Do h:mm a");
      return `${r1} PDT to ${r2} PDT`;
    }
  },
  methods: {
    input(v) {
      const o = {};
      o[v.id] = v.value;
      this.data = { ...this.data, ...o };
    },
    async send() {}
  },
  created() {
    this.$store.dispatch("contest/fetchContests");
    this.$store.dispatch("contest/fetchNominees", {
      contestId: this.contestId
    });
    // this.$store.dispatch("contest/fetchPrizes", {
    //   contestId: this.contestId
    // });
  }
};
</script>
