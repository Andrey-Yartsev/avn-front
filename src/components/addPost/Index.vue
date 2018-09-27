<template>
  <div :class="['addPost', {loaderWrap: isSaving}]">
    <form :class="['add-new-form', { expanded: expanded }]">
      <div class="addPost-header">
        <button type="button" class="header-return-btn go-back"></button>
        <h1 class="page-title">New Post</h1>
        <button
          type="submit"
          class="btn submit sm"
          :disabled="disableShareBtn"
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
          @click="addNewPost"
        >Share</button>
      </div>
    </form>
    <Loader v-if="isSaving" :fullscreen="false"></Loader>
  </div>
</template>

<script>
import Loader from "@/components/loader/Index";

export default {
  name: "AddPost",
  data: () => ({
    expanded: false,
    tweetSend: false,
    postMsg: "",
    isSaving: false
  }),
  components: {
    Loader
  },
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
  },
  methods: {
    addNewPost: function(e) {
      e.preventDefault();
      this.isSaving = true;
      // если нет текста или медий не ничего не делаем

      // var block = this.formModel.get("block");
      // if (block) {
      //   return;
      // }
      // this.formModel.set("block", true);

      // Запускаем какой-то лоудер
      // app.isSaving(this.el);

      // // сохраняем файлы
      // this.addFileCollection.saveFiles().then(function() {
      //   // подготавливаем данные для сохранения на сервере
      //   var data = {
      //     text: this.el.querySelector("textarea").value,
      //     tweetSend: this.el.querySelector(".tweetSend").checked,
      //     mediaFiles: this.addFileCollection.getFiles()
      //   };

      //   if (app.userModel.get("subscribePrice") > 0) {
      //     data.isFree = this.el.querySelector(".is-free-post").checked;
      //   }
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
    }
  }
};
</script>

<style lang="scss" scoped src="@/design/css/addPost.scss">
</style>
