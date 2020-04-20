<template>
  <div class="SearchResultsPopupView">
    <a
      :href="'/' + v.username"
      @click.prevent="goTo('/' + v.username)"
      class="user"
      tabindex="2"
      v-for="v in items"
      v-bind:key="v.id"
    >
      <span class="avatar avatar_gap-r-sm avatar_sm">
        <span class="avatar__img">
          <img :src="v.avatar" v-if="v.avatar" />
        </span>
      </span>
      <div class="username-group">
        <div class="user__name">
          <div class="name">{{ v.name }}</div>
          <span
            class="verified-user icn-item"
            :class="{
              fullyMonetized: v.canEarn && v.canPayoutsRequest
            }"
            v-if="v.isVerified || (v.canEarn && v.canPayoutsRequest)"
          ></span>
        </div>
        <span class="user-login reset-ml">{{ v.username }}</span>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
      this.$emit("away");
    }
  }
};
</script>
