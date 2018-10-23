<template>
  <div class="addNewNav">
    <span :class="['new-post', { active: active === 'post'}]" @click="addPost">
      <span class="add-new-type__text">Post</span>
    </span>
    <span :class="['new-story', { active: active === 'story'}]" @click="addStory">
      <span class="add-new-type__text">Story</span>
    </span>
    <span :class="['new-live', { active: active === 'live'}]" @click="addLive">
      <span class="add-new-type__text">Go live</span>
    </span>
    <span :class="['new-message', { active: active === 'message'}]" @click="addMessage">
      <span class="add-new-type__text">Message</span>
    </span>
  </div>
</template>
<script>
export default {
  name: "AddNewNav",
  props: {
    active: {
      type: String,
      required: true
    }
  },
  methods: {
    addPost: function() {
      this.$router.push("/addPost");
    },
    addStory: function() {
      document.getElementById("storyFileSelect").click();
    },
    addLive: function() {
      this.$router.push("/stream");
    },
    addMessage: function() {
      this.$router.push("/chat");
    }
  }
};
</script>
