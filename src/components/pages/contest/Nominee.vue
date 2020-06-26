<template>
  <div class="userView" :data-id="nominee.id" :class="{ active: active }">
    <div
      class="bg bg-color bg-gradient_light"
      :style="'background-image: url(' + nominee.image_url + ')'"
    ></div>
    <div class="user-container user-container_numbered">
      <div class="avatar avatar_md avatar_md-desk">
        <span class="avatar__img"><img :src="nominee.avatar"/></span>
      </div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + nominee.username" class="name">{{
              nominee.name
            }}</router-link>
            <span class="verified-user icn-item fullyMonetized"></span>
          </div>
          <span class="user-login reset-ml">
            <router-link :to="'/' + nominee.username" class="name">{{
              nominee.username
            }}</router-link>
          </span>
        </div>
      </div>
      <div
        class="user-num-list"
        :class="{ 'user-num-list_first': nominee.n === 1 }"
      >
        <NomineeMenu :nominee="nominee" :contestId="contestId" />
        <span v-if="showRank" class="user-num-list__text">{{ nominee.n }}</span>
      </div>
      <p class="profile-text">{{ nominee.description }}</p>
      <div class="text-centered mt-auto">
        <button
          type="button"
          class="btn alt border btn_fix-width-sm"
          @click="vote"
        >
          Vote
        </button>
      </div>
      <div class="top-votes-container"></div>
    </div>
  </div>
</template>

<script>
import NomineeMenu from "./NomineeMenu";

export default {
  components: {
    NomineeMenu
  },
  props: {
    nominee: Object,
    contestId: Number,
    votesList: Object,
    active: Boolean
  },
  computed: {
    showRank() {
      return this.nominee.rank && this.nominee.rank_display;
    }
  },
  methods: {
    openVoteModal() {
      this.$store.dispatch("modal/show", {
        name: "contestVoting",
        data: {
          name: this.nominee.name,
          contestId: this.contestId,
          votesList: this.votesList,
          nominee: this.nominee.id,
          userId: this.nominee.star_id,
          freeVoteUsed: this.nominee.freeVoteUsed || false
        }
      });
    },
    vote() {
      if (!this.$store.state.auth.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () =>
              this.$router.push(
                `/contests/${this.contestId}/${this.nominee.id}`
              )
          }
        });
        return;
      }
      this.openVoteModal();
    }
  }
};
</script>
