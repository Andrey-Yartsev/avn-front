<template>
  <div :class="['addPost', {loaderWrap: isSaving}]">
    <form :class="['add-new-form', { expanded: expanded }]">
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
        <div class="addFileCollectionView">
          <MediaPreview
            v-for="media in preloadedMedias"
            :media="media"
            :key="media.id"
            v-on:removePostMedia="removePostMedia"
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
          :disabled="notEhoughData"
          @click="addNewPost"
        >Share</button>
      </div>
    </form>
    <Loader v-if="isSaving" :fullscreen="false"></Loader>
  </div>
</template>

<script>
import Loader from "@/components/loader/Index";
import MediaPreview from "./MediaPreview";
import { getMediaFilePreview, fileUpload, uniqId } from "@/helpers/mediaFiles";

export default {
  name: "AddPost",
  data: () => ({
    expanded: false,
    tweetSend: false,
    postMsg: "",
    isSaving: false,
    isFree: false,
    preloadedMedias: []
  }),
  components: {
    Loader,
    MediaPreview
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    notEhoughData() {
      return !this.postMsg.length;
    }
  },
  methods: {
    addNewPost: function(e) {
      e.preventDefault();

      // если нет текста или медий не ничего не делаем
      // if (this.notEhoughData) {
      //   return;
      // }

      // // Запускаем какой-то лоудер
      // this.isSaving = true;

      // подготавливаем данные для сохранения на сервере
      const newPostData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        mediaFiles: [] //this.addFileCollection.getFiles()
      };

      if (this.hasSubscribePrice) {
        newPostData.isFree = this.isFree;
      }

      const promises = this.preloadedMedias.map(m =>
        fileUpload(m.id, m.file, this.uploadProgress)
      );

      Promise.all(promises).then(() => {
        //console.log("all files uploaded");
      });
    },

    addMediaFiles: async function(e) {
      const files = e.target.files;
      if (!files.length) return;

      for (let i = 0; i < files.length; i += 1) {
        const preview = await getMediaFilePreview(files[i]);

        this.preloadedMedias.push({
          file: files[i],
          userFileName: files[i].name,
          preview: preview.preview,
          id: uniqId(),
          loaded: 0
        });
      }

      e.target.value = "";
    },
    removePostMedia(id) {
      this.preloadedMedias = this.preloadedMedias.filter(m => m.id !== id);
    },

    uploadProgress(id, loaded, total) {
      this.preloadedMedias = this.preloadedMedias.map(
        m => (m.id === id ? { ...m, loaded: (loaded / total) * 100 } : m)
      );
    }
  }
};
</script>

<style lang="scss" scoped src="@/design/css/addPost.scss">
</style>
