<template>
    <div class="stories-wrapper">
        <div class="storyCollectionView">
            <h4>Stories</h4>
            <div class="stories-group">
                <div class="storyView create-story-button">
                    <div class="story">
                        <div class="story-avatar">
                            <a class="avatar new-story">
                                <img v-if="user.avatar" :src="user.avatar">
                            </a>
                            <span class="btn-add">
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
                <input class="hidden storyFileSelect" accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi" type="file">
                <div class="stories"></div>
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
  }
};
</script>
