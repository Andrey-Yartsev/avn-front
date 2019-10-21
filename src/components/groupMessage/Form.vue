<template>
  <div :class="['addPost', { truncated: !user.isPerformer }]">
    <form
      class="add-new-form"
      :class="{ 'bg-gradient_light': $mq === 'desktop' }"
    >
      <router-link
        :to="'/' + user.username"
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </router-link>
      <div class="text-media-container">
        <textarea
          ref="groupMessageTextarea"
          class="textarea sm rounded"
          placeholder="What's going on?"
        />
      </div>
      <div class="actions">
        <!-- <div class="actions-controls">
          <span class="add-media-input btn-post" @click="goToAddPost"
            ><span class="icn-media icn-item icn-size_lg"></span
          ></span>
        </div>
        <div class="add-new-type add-new-type_underline-items line-top" /> -->
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddPostFakeForm",
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    goToAddPost() {
      if (this.$refs.groupMessageTextarea) {
        this.$refs.groupMessageTextarea.blur();
      }
    }
  }
};
</script>
