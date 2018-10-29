<template>
  <div :class="['addPost', {loaderWrap: isSaving}]">
    <form :class="['add-new-form', { expanded: expanded || initialExpanded }]">
      <div class="addPost-header">
        <button type="button" class="header-return-btn go-back"></button>
        <h1 class="page-title">New Post</h1>
        <button
          type="submit"
          class="btn submit sm"
          :disabled="notEhoughData"
          @click="addNewPost"
        >Share</button>
      </div>
      <span class="avatar">
        <img v-if="user.avatar" :src="user.avatar" />
      </span>
      <div class="text-media-container">
        <textarea
          @focus="expanded = true"
          class="sm"
          placeholder="What is going on?"
          maxlength="500"
          v-model="postMsg"
        ></textarea>
        <div class="addFileCollectionView">
          <MediaPreview
            v-for="media in preloadedMedias"
            :media="media"
            :key="media.id"
            v-on:removeMedia="removeMedia"
            :isSaving="isSaving"
          />
        </div>
      </div>
      <div class="actions">
        <div class="actions-controls">
          <label class="add-media-input">
            <input type="file" multiple @change="addMediaFiles">
          </label>
          <!--<span class="voting-block-toggle-btn"></span> TODO votiong block-->
          <template v-if="hasSubscribePrice">
            <div class="b-check-state">
              <label>
                <input class="is-free-post" type="checkbox" v-model="isFree">
                <span class="b-check-state__icon"></span>
                <span class="b-check-state__text">Free Post</span>
              </label>
            </div>
          </template>
        </div>
        <div class="add-new-type add-new-type_underline-items line-top">
          <AddNewNav active="post" />
        </div>
        <label :class="['tweet-new-post', {hidden: !user.isAllowTweets}]">
          <input class="tweetSend" type="checkbox" :checked="tweetSend">
          <span class="icon" @click="tweetSend = !tweetSend"></span>
        </label>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="notEhoughData"
          @click="addNewPost"
        >Share</button>
      </div>
    </form>
    <Loader v-if="isSaving" :fullscreen="false"></Loader>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import AddNewNav from "@/components/addNewNav/Index";

export default {
  name: "AddPost",
  mixins: [FileUpload],
  data: () => ({
    expanded: false,
    tweetSend: false,
    postMsg: "",
    isSaving: false,
    isFree: false
  }),
  components: {
    Loader,
    MediaPreview,
    AddNewNav
  },
  props: {
    initialExpanded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    notEhoughData() {
      return !this.postMsg.length && !this.preloadedMedias.length;
    }
  },
  methods: {
    addNewPost: async function(e) {
      e.preventDefault();

      if (this.notEhoughData) return;

      this.isSaving = true;

      const mediaFiles = await this.getMediaFiles();

      const newPostData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        mediaFiles
      };

      if (this.hasSubscribePrice) {
        newPostData.isFree = this.isFree;
      }

      this.$store.dispatch("post/savePost", newPostData);
    }
  }
};
</script>
