<template>
  <div class="userView">
    <div class="bg bg-color bg-gradient_light"></div>
    <div class="user-container user-container_numbered">
      <div class="avatar avatar_md avatar_md-desk">
        <span class="avatar__img"><img :src="props.image_url"/></span>
      </div>
      <div class="names-actions-wrapper">
        <div class="user-names">
          <div class="wrap-name">
            <router-link :to="'/' + props.username" class="name">{{
              props.name
            }}</router-link>
            <span class="verified-user icn-item fullyMonetized"></span>
          </div>
          <span class="user-login reset-ml">
            <router-link :to="'/' + props.username" class="name">{{
              props.username
            }}</router-link>
          </span>
        </div>
        <button
          type="button"
          class="btn alt border btn_fix-width-sm"
          @click="vote"
        >
          Vote
        </button>
      </div>
      <div
        class="user-num-list"
        :class="{ 'user-num-list_first': props.n === 1 }"
      >
        <span class="user-num-list__text">{{ props.n }}</span>
      </div>
      <p class="profile-text">{{ props.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    props: Object,
    contestId: Number
  },
  methods: {
    vote() {
      this.$store.dispatch("modal/show", {
        name: "contestVoting",
        data: {
          name: this.props.name,
          contestId: this.contestId
        }
      });
    }
  }
};
</script>
