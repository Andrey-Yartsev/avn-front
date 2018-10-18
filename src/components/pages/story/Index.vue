<template>
  <div class="StoryPageCollectionView" v-if="!loading">
    <div class="stories-slideshow">
      <div class="StoryPageView active">
        <template v-if="post.mediaType === 'photo'">
          <img class="bg" :src="post.mediaSrc" alt>
          <img class="storyItem" :src="post.mediaSrc" alt>
        </template>
        <video 
          v-if="post.mediaType === 'video'"
          class="story-video-element storyItem" 
          :src="post.mediaSrc" 
          webkit-playsinline playsinline muted disableremoteplayback
        ></video>
      </div>
    </div>
    <template v-if="length > 1">
      <button type="button" class="btn-prev" />
      <button type="button" class="btn-next" />
    </template>
    <div class="progress-pagination">
      <div v-for="i in [1,2]" class="item" :data-index="i" :key="i">
        <div class="item-filler" />
      </div>
    </div>
    <div class="head-story">
      <div class="story-avatar">
          <a 
            :href="isOwner(user.id) ? `/${user.username}` : ''"
            :class="['avatar', {'new-story': isOwner(user.id)}]"
          >
            <img v-if="user.avatar" :src="user.avatar">
          </a>
          <template v-if="isOwner(user.id)">
            <span class="btn-add">
              <svg aria-hidden="true" class="icn icn-plus"><use xlink:href="#icon-plus-in-circle"></use></svg>
            </span>
            <input
              type="file"
              class="hidden storyFileSelect"
              accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
            />
          </template>
      </div>
      <div class="user-name">
        <a 
          :href="isOwner(user.id) ? `/${user.username}` : ''"
          :class="{'new-story': isOwner(user.id)}"
        >
          {{ isOwner(user.id) ? 'Your story' : user.name || user.username }}
        </a>
        <span class="time"></span>
      </div>
    </div>    
    <span class="story-dropdown-menu-btn"></span>
    <div class="dropdown-menu hidden">
      <template v-if="isOwner(user.id)">
        <button class="deleteStory" type="button">Delete</button>
        <button class="saveFile" type="button">Save</button>
        <button class="storySettings" type="button">Story Settings</button>
      </template>
      <button class="cancelDropdown" type="button">Cancel</button>
    </div>
    <div class="bottom-btns">
      <template v-if="!isOwner(user.id) && user.canEarn">
        <button type="button" class="btn-tip"></button>
        <form class="tip-form hidden">
            <button type="button" role="button" class="btn btn-cancel">Cancel</button>
            <div class="tip-amount-field">
                <input class="tip-amount-input rounded" type="text" pattern="\d{1,5}(?:\.\d{0,2})?" maxlength="8" placeholder="Enter tip amount">
            </div>    
            <button type="submit" class="btn btn-send" disabled>Send tip</button>
        </form>
      </template>
    </div>
    <button type="button" class="close"></button>
    <div class="play-button-wrapper hidden" id="video-play-button">
      <div class="play-button-outer">
        <div class="play-button"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoryPage",
  computed: {
    length() {
      return this.$store.state.stories.posts.length;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    user() {
      return this.$store.state.stories.user;
    },
    post() {
      return this.$store.state.stories.posts[0];
    },
    loading() {
      return this.$store.state.stories.loading;
    }
  },
  methods: {
    isOwner: () => true
  },
  created() {
    const userId = this.$route.params.userId;
    this.$store.dispatch("stories/resetPageState");
    this.$store.dispatch("stories/getUserPosts", { userId });
  }
};
</script>
