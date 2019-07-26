<template>
  <div class="SearchResultsPopupView">
    <a
      :href="'/' + v.username"
      @click.prevent="select(v)"
      class="user"
      tabindex="2"
      v-for="v in items"
      :key="v.id"
    >
      <span class="avatar avatar_gap-r-sm avatar_sm">
        <span class="avatar__img">
          <img :src="v.avatar" v-if="v.avatar" />
        </span>
      </span>
      <div class="username-group">
        <div class="user__name">
          <div class="name">{{ v.name }}</div>
          <span v-if="v.isVerified" class="verified-user icn-item"></span>
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
    select(user) {
      console.log(user);
      this.$emit("select", user);
    }
  }
};
</script>
