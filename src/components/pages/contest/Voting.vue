<template>
  <div class="reasons reasons__content bg-gradient_light">
    <div class="form-group radio-group radio-group_no-gaps">
      <label
        v-for="v in votesOptions"
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
            v-model="votes"
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
    props: Object
  },
  data() {
    return {
      votes: null
    };
  },
  computed: {
    votesOptions() {
      return Object.entries(this.votesList).map(v => {
        return {
          id: v[0],
          title: v[1]
        };
      });
    },
    contests() {
      return this.$store.state.contest.fetchContestsResult;
    },
    contest() {
      return this.contests.find(v => v.id === this.props.contestId);
    },
    votesList() {
      return this.contest.votesList;
    }
  },
  methods: {
    select(votes) {
      this.votes = votes;
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
      const params = {
        contestId: this.props.contestId,
        votes: this.votes,
        nominee: this.props.nominee,
        userId: parseInt(this.props.userId)
      };

      this.$store.dispatch("contest/vote", params).then(r => {
        if (r.success) {
          this.$store.dispatch("global/flashToast", {
            text: "You have been successfully voted"
          });
          this.$emit("close");
        }
      });
    }
  },
  created() {
    this.votes = this.votesOptions[0].id;
  }
};
</script>
