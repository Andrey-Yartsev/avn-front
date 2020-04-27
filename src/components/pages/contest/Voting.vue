<template>
  <div class="reasons reasons__content bg-gradient_light">
    <div class="form-group radio-group radio-group_no-gaps">
      <label
        v-for="v in prizeOptions"
        class="form-group-inner"
        :class="{ 'no-border-line': $mq === 'mobile' }"
        :key="v.id"
      >
        <div class="radio-wrapper icn-item">
          <input
            type="radio"
            name="vote"
            :value="v.id"
            @click="select(v)"
            v-model="prize"
          />
          <span class="label">{{ v.title }}</span>
        </div>
      </label>
      <div class="form-group bottom-buttons">
        <div></div>
        <button class="btn ok-btn" @click="vote">
          Vote
        </button>
        <button class="btn border" @click="$emit('close')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";

export default {
  mixins: [User],
  props: {
    contestId: Number,
    list: Object
  },
  data() {
    return {
      prize: null
    };
  },
  computed: {
    prizeOptions() {
      console.log(Object.entries(this.votesList));
      return Object.entries(this.votesList).map(v => {
        return {
          id: v[0],
          title: v[1]
          // title: `$${v.rank} = ${v.amount} Vote` + (v.rank > 1 ? "s" : "")
        };
      });
    },
    prizes() {
      return this.$store.state.contest.fetchPrizesResult;
    },
    contests() {
      return this.$store.state.contest.fetchContestsResult;
    },
    contest() {
      return this.contests.find(v => v.id === this.contestId);
    },
    votesList() {
      return this.contest.votesList;
    }
  },
  methods: {
    select(prize) {
      this.prize = prize;
    },
    vote() {
      if (!this.user.isPaymentCardConnected) {
        this.$store.dispatch("global/flashToast", {
          text: "You should add card in payment settings",
          type: "warning"
        });
        this.$store.commit(
          "payment/card/setAfterAddCardRedirect",
          this.$route.path
        );
        this.$router.push("/settings/payments");
        return;
      }
      this.$store
        .dispatch("contest/vote", {
          contestId: this.contestId
        })
        .then(r => {
          if (r.success) {
            this.$store.dispatch("global/flashToast", {
              text: "You have beed successfully voted"
            });
            this.$emit("close");
          }
        });
    }
  },
  created() {
    this.prize = this.prizeOptions[0].id;
  }
};
</script>
