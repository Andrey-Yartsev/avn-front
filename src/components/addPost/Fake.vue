<template>
  <div class="addPost">
    <form class="add-new-form bg-gradient_light-desk bg-gradient_light">
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </span>
      <div class="text-media-container">
        <textarea
          ref="textarea"
          class="sm"
          placeholder="What's going on?"
          @click="goToAddPost"
        />
      </div>
      <div class="actions">
        <div class="actions-controls">
          <label class="add-media-input btn-post" @click="goToAddPost" />
          <div
            class="btn-post btn-post_datetime"
            v-if="user.isPerformer"
            @click="goToAddPost"
          >
            <div class="post-datetime">
              <span class="post-datetime__btn" />
            </div>
          </div>
          <div class="btn-post" v-if="user.isPerformer">
            <router-link class="b-check-state b-check-state_live" to="/stream"
              ><span class="btn-post__text exception"
                >Go live</span
              ></router-link
            >
          </div>
        </div>
        <div class="add-new-type add-new-type_underline-items line-top" />
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
      if (this.$refs.textarea) {
        this.$refs.textarea.blur();
      }

      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    }
  }
};
</script>
