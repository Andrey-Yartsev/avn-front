<template>
  <div class="reasons reasons__content bg-gradient_light">
    <div class="form-group radio-group radio-group_no-gaps">
      <div v-if="isAuthor && freeVoteUsed" style="text-align: center">
        Sorry, but you've already used a free vote for yourself
      </div>
      <template v-else>
        <template v-if="showTwitterButton">
          <a
            :id="'nominee' + props.nominee"
            ref="tweetLink"
            target="popup"
            :href="getHrefString"
            @click.prevent="clickTweetLink"
            class="btn-block btn-twitter"
            data-show-count="false"
          >
            <span class="icn-item icn-twitter icn-size_sm"></span>
            <span class="btn-twitter__label">Tweet</span>
          </a>
        </template>
        <template v-else>
          <label
            v-for="v in votesOptions"
            class="form-group-inner"
            :class="{ 'no-border-line': $mq === 'mobile' }"
            :key="v.id"
          >
            <div class="radio-wrapper icn-item">
              <input
                :disabled="
                  v.id == 1 && (props.freeVoteUsed || isSingleFreeVoteUsed)
                "
                type="radio"
                name="vote"
                :value="v.id"
                @click="select(v)"
                v-model="votes"
              />
              <span
                class="label"
                :class="{
                  disabled:
                    v.id == 1 && (props.freeVoteUsed || isSingleFreeVoteUsed)
                }"
                >{{ v.title }}</span
              >
            </div>
            <!-- <div
              v-if="v.id == 1 && emailNotConfirmed"
              class="confirmEmailMessage"
            >
              confirm your email addres to use free vote
            </div> -->
          </label>
        </template>
        <div v-if="!showTwitterButton" class="form-group bottom-buttons">
          <div></div>
          <button class="btn ok-btn" @click="vote" :disabled="votingInProgress">
            Vote
          </button>
          <button class="btn border" @click="$emit('close')">
            Cancel
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import PayAction from "../settings/payments/payAction";

export default {
  mixins: [User, PayAction],
  props: {
    props: Object
  },
  data() {
    return {
      votes: null,
      votingInProgress: false,
      showTwitterButton: false
    };
  },
  computed: {
    votesOptions() {
      return Object.entries(this.votesList).map(v => {
        return {
          id: v[0],
          title: v[1] + (v[0] > 1 ? " - " + "$" + v[0] : " - Free")
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
      if (this.isAuthor) {
        return {
          1: this.contest.votesList["1"]
        };
      }
      // if (this.props.freeVoteUsed) {
      //   const votesOption = {...this.contests.votesList}
      //   delete votesOption["1"]
      //   return
      //   return {...this.contests.votesList}
      // }
      return this.contest.votesList;
    },
    payPayload() {
      return {
        paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken,
        contestId: this.props.contestId,
        votes: this.votes,
        amount: this.votes,
        nominee: this.props.nominee,
        userId: parseInt(this.props.userId)
      };
    },
    voteError() {
      return this.$store.state.contest.voteError;
    },
    freeVoteUsed() {
      return this.props.freeVoteUsed;
    },
    isAuthor() {
      return this.user && this.user.id == this.props.userId;
    },
    getTextString() {
      return `#AVNStars ${window.location.origin}/${this.props.username}/c/${
        this.props.contestId
      }/${this.props.userId}`;
    },
    getHrefString() {
      const fullText = `I voted for @${this.props.nomineeTwitter} for ${
        this.props.contestName
      } at ${this.getTextString}`;
      let text = encodeURI(fullText) || "";
      text = text.replace(/#/g, "%23");
      return `https://twitter.com/intent/tweet?text=${text}`;
    },
    isSingleFreeVoteUsed() {
      return (
        this.$store.state.contest.singleNominee &&
        this.$store.state.contest.singleFreeVoteUsed
      );
    },
    emailNotConfirmed() {
      return (
        this.$store.state.auth.user && !this.$store.state.auth.user.isVerified
      );
    }
  },
  watch: {
    voteError() {
      this.$emit("close");
      this.votingInProgress = false;
    }
  },
  methods: {
    select(votes) {
      this.votes = votes;
    },
    vote() {
      if (this.votes == 1 && this.emailNotConfirmed) {
        this.$store.dispatch("global/flashToast", {
          text: "Please, confirm your email to use free vote",
          type: "warning"
        });
        return;
      }
      this.votingInProgress = true;

      setTimeout(() => {
        if (this.votes == 1 && !this.props.freeVoteUsed) {
          this._vote();
          return;
        }

        // if (!this.user.isPaymentCardConnected) {
        //   this.$store.dispatch("global/flashToast", {
        //     text: "You should add card in payment settings",
        //     type: "warning"
        //   });
        //   this.$store.commit(
        //     "payment/card/setAfterAddCardRedirect",
        //     this.$route.path
        //   );
        //   this.$router.push("/settings/payments");
        //   return;
        // }

        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Voting confirm",
            text: `You are going to vote for ${this.props.name} for $${
              this.votes
            }`,
            success: () => {
              this._vote();
            },
            finally: () => {
              this.votingInProgress = false;
            }
          }
        });
      }, 1);
    },
    _vote() {
      this._pay(
        this.payPayload,
        () => {
          this.$store.dispatch("global/flashToast", {
            text: "You have been successfully voted"
          });
          if (this.props.nomineeTwitter) {
            this.showTwitterButton = true;
          } else {
            this.$emit("close");
          }
          this.votingInProgress = false;
        },
        {
          dispatchAction: "contest/_vote"
        }
      );
    },
    clickTweetLink() {
      this.showTwitterButton = false;
      this.$emit("close");
      window.open(
        this.getHrefString,
        "popup",
        "menubar=1,resizable=1,width=500,height=400"
      );
    }
  },
  mounted() {
    if (this.props.freeVoteUsed || this.isSingleFreeVoteUsed) {
      this.votes = this.votesOptions[1].id;
    } else {
      this.votes = this.votesOptions[0].id;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-twitter {
  color: white;
  background-color: #1b95e0;
  padding: 5px 8px;
  font-size: 16px;
  border-radius: 3px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  width: 81px;
  margin: auto;

  &:hover {
    background-color: #0c7abf;
    color: white;
  }

  .icn-twitter {
    margin-right: 5px;
  }
}
.label.disabled {
  opacity: 0.5;
}
.confirmEmailMessage {
  font-size: 12px;
  position: absolute;
  left: 30px;
  bottom: 0;
  opacity: 0.5;
}
</style>
