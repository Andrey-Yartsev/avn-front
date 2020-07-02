<template>
  <div class="container contest">
    <Navigate />
    <div class="loader-container" v-if="loading">
      <Loader text="" :fullscreen="false" :small="true" />
    </div>
    <template v-else>
      <template v-if="contest">
        <!-- <div class="contest-links title-subtext">
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
          <div v-if="nominee" class="explore-wrapper users">
            <div />
            <Nominee
              :nominee="nominee"
              :contestId="contestId"
              :contestName="contest.name"
              :active="true"
              :isVotingActive="contest.is_voting_active"
            />
          </div>
          <router-link
            class="btn btn_fix-width-ex-lg lg alt"
            style="display: block; margin: auto;"
            :to="`/contests/${contestId}`"
          >
            See all nominees
          </router-link>
        </template>
      </template>
      <!-- <template v-else>
        <div class="inner">
          <div class="semi-transparent" :style="{ 'text-align': 'center' }">
            There is no available contests for now
          </div>
        </div>
      </template> -->
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

export default {
  name: "SingleNominee",
  mixins: [User],
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
      contestId: 0,
      activeNomineeId: 0,
      nominee: null,
      isLoading: true
    };
  },
  computed: {
    categories() {
      return [];
    },
    loading() {
      if (this.$store.state.contest.fetchContestsLoading || this.isLoading) {
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
    // _nominees() {
    //   return this.$store.state.contest.nominees;
    // },
    // nominees() {
    //   return this._nominees.map((v, i) => {
    //     v.n = i + 1;
    //     return v;
    //   });
    // },
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
    }
  },
  methods: {
    init() {
      // if (!this.contestId) {
      //   return;
      // }
      this.$store
        .dispatch("contest/_fetchNomineeItem", {
          contestId: this.$route.params.contestId,
          nomineeId: this.$route.params.nomineeId
        })
        .then(res => {
          this.nominee = res;
          this.$nextTick(() => {
            this.openVoteModal();
          });
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    input(v) {
      const o = {};
      o[v.id] = v.value;
      this.data = { ...this.data, ...o };
    },
    async send() {},
    openVoteModal() {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () =>
              this.$router.push(
                `/contests/${this.contestId}/${this.$route.params.nomineeId}`
              )
          }
        });
      } else {
        this.$store.dispatch("modal/show", {
          name: "contestVoting",
          data: {
            name: this.nominee.name,
            contestId: this.contestId,
            nominee: this.nominee.nominee_id,
            userId: this.$route.params.nomineeId
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
    }
    // contestId(contestId) {
    //   const nomineeId = this.$route.params.nomineeId;
    //   console.log(nomineeId, contestId)
    //   if (nomineeId) {
    //     this.$router.push(`/contests/${contestId}#nominee${nomineeId}`);
    //   } else {
    //     this.$router.push(`/contests/${contestId}`);
    //   }
    //   this.init();
    // }
  },
  mounted() {
    if (!this.allowContestsView) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("contest/fetchContests");
    this.init();
  }
};
</script>
