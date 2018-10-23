<template>
    <div class="stories-wrapper">
        <div class="storyCollectionView">
            <h4>Stories</h4>

            <div class="stories-group__outer">
                <div class="stories-group">
                    <div class="stories-group__inner">
                        <div class="storyView create-story-button">
                            <div class="story">
                                <div class="story-avatar">
                                    <a class="avatar new-story">
                                        <img v-if="user.avatar" :src="user.avatar">
                                    </a>
                                    <span class="btn-add" @click.prevent="addNewStory">
                                        <svg aria-hidden="true" class="icn icn-plus">
                                            <use xlink:href="#icon-plus-in-circle"></use>
                                        </svg>
                                    </span>
                                </div>
                                <div class="story-info">
                                    <div class="name">Your story</div>
                                    <div class="user-login">
                                        <a class="new-story">Create new story</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="stories"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "StoriesWrapper",
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    addNewStory: function() {
      document.getElementById("storyFileSelect").click();
    }
  }
};
</script>
