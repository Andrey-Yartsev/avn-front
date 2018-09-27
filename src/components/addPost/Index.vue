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
          <MediaPreview v-for="media in preloadedMediaFiles" :media="media" :key="media.userFileName" />
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
import mediaFilePreviewHepler from "@/helpers/mediaFilePreview";

export default {
  name: "AddPost",
  data: () => ({
    expanded: false,
    tweetSend: false,
    postMsg: "",
    isSaving: false,
    isFree: false,
    preloadedMediaFiles: []
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
      if (this.notEhoughData) {
        return;
      }

      // Запускаем какой-то лоудер
      this.isSaving = true;

      // подготавливаем данные для сохранения на сервере
      const newPostData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        mediaFiles: [] //this.addFileCollection.getFiles()
      };

      if (this.hasSubscribePrice) {
        newPostData.isFree = this.isFree;
      }

      this.$store.dispatch("home/savePost", newPostData);

      // // сохраняем файлы
      // this.addFileCollection.saveFiles().then(function() {
      //
      //
      //   // сохраняем пост
      //   this.model.save(data).then(function(data) {
      //     // очищаем модель
      //     this.formModel.set("block", false);
      //     this.model.clear();
      //     this.addFileCollection.reset();

      //     // перерисовываем
      //     this.render();

      //     if (window.location.pathname === "/") {
      //       // скрывает попапы
      //       app.popups.hide();
      //       // тригерим событие что новый пост добавлен
      //       Backbone.trigger("postModelAdded", data);
      //       // скрываем лоудер
      //       app.hideLoader(this.el);
      //     } else {
      //       // делаем переход
      //       app.router.navigate("/", { trigger: true });
      //     }
      //   });
      // }); /*TODO error handling*/
    },

    addMediaFiles: async function(e) {
      const files = e.target.files;

      if (!files.length) return;

      for (let i = 0; i < files.length; i += 1) {
        this.preloadedMediaFiles.push({
          file: files[i],
          userFileName: files[i].name,
          preview: await mediaFilePreviewHepler(files[i])
        });
      }

      // return Promise.all(uploaded_files);

      // var callback = function(addedFiles) {
      //   this.mediaCount += addedFiles.length;
      //   this.validate();
      //   files.value = "";
      // }.bind(this);

      // this.addFileCollection
      //   .addFiles(files)
      //   .then(callback)
      //   .catch(
      //     function() {
      //       //manual cancel during upload gets here too
      //       callback([]);
      //     }.bind(this)
      //   );

      /**
       * Array of jqXHR objects, which implement Promise interface
       */

      // return Promise.all(uploaded_files);
    }
  }
};
</script>

<style lang="scss" scoped src="@/design/css/addPost.scss">
</style>
