<template>
  <div class="container contest">
    <Navigate />
    <div class="loader-container" v-if="loading && isFirstInit">
      <Loader text="" :fullscreen="false" :small="true" />
    </div>
    <template v-else>
      <template v-if="contest">
        <div class="contest-links title-subtext">
          <template v-for="value in contests">
            <a
              :href="`/contests/${value.id}`"
              :key="value.id"
              @click.prevent="selectContest(value.id)"
              :class="{ selected: value.id === contestId }"
            >
              {{ value.name }}
            </a>
            <span :key="`span-${value.id}`"> || </span>
          </template>
        </div>
        <!-- <div class="awards-title text-centered">
          <select name="contest" v-model="contestId">
            <option v-for="(v, k) in contests" :key="k" :value="v.id"
              >{{ v.name }}
            </option>
          </select>
        </div> -->
        <template v-if="!sent">
          <div class="contest-header" v-if="contest.image_url">
            <img :src="contest.image_url" />
          </div>
          <div class="title-subtext text-centered ">
            <h3 v-html="contest.description" class="contest-title" />
            <span class="contest-period semi-transparent">{{
              periodText
            }}</span>
          </div>
          <div class="explore-wrapper users">
            <Nominee
              v-for="v in nominees"
              :key="v.id"
              :nominee="v"
              :contestId="contestId"
              :contestName="contest.name"
              :active="activeNomineeId === v.id"
              :isVotingActive="contest.is_voting_active"
            />
          </div>
          <div v-if="nominees.length" ref="scrollObserver"></div>
        </template>
      </template>
      <template v-else>
        <div class="inner">
          <div class="semi-transparent" :style="{ 'text-align': 'center' }">
            There is no available contests for now
          </div>
        </div>
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
import moment from "moment-timezone";
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "Contest",
  mixins: [User, IntersectionObserver],
  components: {
    Navigate,
    Footer,
    Loader,
    Nominee
  },
  data() {
    return {
      data: {},
      scriptLoading: true,
      activeNomineeId: 0,
      contestId: 0,
      isFirstInit: true
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
    contests() {
      return this.$store.state.contest.fetchContestsResult;
    },
    contest() {
      return this.contests.find(v => v.id === this.contestId);
    },
    _nominees() {
      return this.$store.state.contest.nominees;
    },
    nominees() {
      return this._nominees.map((v, i) => {
        v.n = i + 1;
        return v;
      });
    },
    periodText() {
      const d1 = this.contest.starts_at.replace(/(.*)-\d+:\d+/, "$1");
      const m1 = moment(d1).tz(this.contest.timezone);
      let r2 = null;
      if (this.contest.ends_at) {
        const d2 = this.contest.ends_at.replace(/(.*)-\d+:\d+/, "$1");
        const m2 = moment(d2).tz(this.contest.timezone);
        r2 = m2.format("MMM Do h:mm a");
      }
      const r1 = m1.format("MMM Do h:mm a");
      let s = `${r1} PDT`;
      if (r2) {
        s += ` to ${r2} PDT`;
      }
      return s;
    },
    allowContestsView() {
      if (this.user) {
        return (
          this.user.showVote || // showVote is admin user, renamed for secure reason
          this.user.adminReturnUrl ||
          this.$store.state.init?.data?.enableContests
        );
      } else {
        return this.$store.state.init?.data?.enableContests;
      }
    },
    allDataRecieved() {
      return this.$store.state.contest.allDataReceived;
    }
  },
  methods: {
    init() {
      if (!this.contestId) {
        return;
      }
      this.$store
        .dispatch("contest/_fetchNominees", {
          contestId: this.contestId
        })
        .then(() => {
          if (this.isFirstInit) {
            this.scrollToShared();
            this.isFirstInit = false;
          }
          this.isInitFetch = false;
          this.handleResponseWithIntersectionObserver(this.init);
        });
    },
    input(v) {
      const o = {};
      o[v.id] = v.value;
      this.data = { ...this.data, ...o };
    },
    async send() {},
    scrollToShared() {
      if (window.location.hash) {
        const m = window.location.hash.match(/#nominee(\d+)/);
        if (m) {
          this.$scrollTo(`[data-id="${m[1]}"]`);
          this.activeNomineeId = parseInt(m[1]);
          this.openVoteModal();
        }
      }
    },
    openVoteModal() {
      const currentNominee = this.nominees.find(
        item => item.id === this.activeNomineeId
      );
      if (!currentNominee) {
        return;
      }
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () =>
              this.$router.push(
                `/contests/${this.contestId}/${currentNominee.id}`
              )
          }
        });
      } else {
        this.$store.dispatch("modal/show", {
          name: "contestVoting",
          data: {
            name: currentNominee.name,
            contestId: this.contestId,
            nominee: currentNominee.id,
            userId: currentNominee.star_id
          }
        });
      }
    },
    selectContest(value) {
      this.contestId = value;
    }
  },
  watch: {
    contests(contests) {
      if (!contests.length) {
        return;
      }
      let contestId = contests[0].id;
      if (this.$route.params.contestId) {
        let _contestId = parseInt(this.$route.params.contestId);
        if (contests.find(v => v.id == this.$route.params.contestId)) {
          contestId = _contestId;
        }
      }
      this.contestId = contestId;
    },
    contestId(contestId) {
      const nomineeId = this.$route.params.nomineeId;
      if (nomineeId) {
        this.$router.push(`/contests/${contestId}#nominee${nomineeId}`);
      } else {
        this.$router.push(`/contests/${contestId}`);
      }
      this.init();
    }
  },
  created() {
    if (!this.allowContestsView) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("contest/fetchContests");
    this.init();
  }
};
</script>
