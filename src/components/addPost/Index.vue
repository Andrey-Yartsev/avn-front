<template>
  <div class="addPost">
    <form :class="['add-new-form', { expanded: expanded }]">
      <div class="addPost-header">
        <button type="button" class="header-return-btn go-back"></button>
        <h1 class="page-title">New Post</h1>
        <button
          type="submit"
          class="btn submit sm"
          :disabled="disableShareBtn"
        >Share</button>
      </div>
      <span class="avatar">
        <img :src="user.avatar" />
      </span>
      <div class="text-media-container">
        <textarea
          @focus="expanded = true"
          class="sm"
          placeholder="What is going on?"
          maxlength="500"
          v-model="postMsg"
        ></textarea>
        <div class="addFileCollectionView"></div>
      </div>
      <div class="actions">
        <div class="actions-controls">
          <label class="add-media-input"><input type="file" multiple></label>
          <!--<span class="voting-block-toggle-btn"></span> TODO votiong block-->
          <template v-if="hasSubscribePrice">
            <div class="b-check-state">
              <label>
                <input class="is-free-post" type="checkbox">
                <span class="b-check-state__icon"></span>
                <span class="b-check-state__text">Free Post</span>
              </label>
            </div>
          </template>
        </div>
        <div class="add-new-type add-new-type_underline-items line-top">
          <div class="addNewNav">
            <span class="new-post active"><span class="add-new-type__text">Post</span></span>
            <span class="new-story"><span class="add-new-type__text">Story</span></span>
            <span class="new-live"><span class="add-new-type__text">Go live</span></span>
            <span class="new-message"><span class="add-new-type__text">Message</span></span>
            <input type="file" class="hidden storyFileSelect"
                  accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"/>
          </div>
        </div>
        <label :class="['tweet-new-post', {hidden: !user.isTwitterConnected}]">
          <input class="tweetSend" type="checkbox" :checked="tweetSend">
          <span class="icon" @click="tweetSend = !tweetSend"></span>
        </label>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="disableShareBtn"
        >Share</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddPost",
  data: () => ({
    expanded: false,
    tweetSend: false,
    postMsg: ""
  }),
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    disableShareBtn() {
      return !this.postMsg.length;
    }
  }
};
</script>