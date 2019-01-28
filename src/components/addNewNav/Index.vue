<template>
  <div class="addNewNav">
    <span
      :class="['new-post', { active: active === 'post' }]"
      class="addNewNav__item"
      @click="addPost"
    >
      <span class="addNewNav__text">Post</span>
    </span>
    <span
      :class="['new-story', { active: active === 'story' }]"
      class="addNewNav__item"
      @click="addStory"
    >
      <span class="addNewNav__text">Story</span>
    </span>
    <span
      :class="['new-live', { active: active === 'live' }]"
      class="addNewNav__item"
      @click="addLive"
    >
      <span class="addNewNav__text">Go live</span>
    </span>
    <span
      :class="['new-message', { active: active === 'message' }]"
      class="addNewNav__item"
      @click="addMessage"
    >
      <span class="addNewNav__text">Message</span>
    </span>
  </div>
</template>
<script>
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "AddNewNav",
  mixins: [ModalRouterGoto],
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
      this.goToModalRoute("/chat");
    }
  }
};
</script>
