<template>
    <div class="post">
        <div class="post-details">
            <PostHeader :id="item.id" :user="item.author"></PostHeader>
            <p class="text">{{ item.text }}</p>
            <div class="media">
                <template v-if="item.media.length > 1">
                  <div class="media-slider">
                    <figure :key="key" v-for="(value, key) in item.media" :class="[{ active: currentSlide === key }, 'media-item']" :data-index="key">
                      <component :is="getMediaViewType(value)" :media="value"></component>
                    </figure>
                  </div>
                </template>
                <template v-else >
                    <figure :key="key" v-for="(value, key) in item.media" class="media-item active">
                      <component :is="getMediaViewType(value)" :media="value"></component>
                    </figure>
                </template>
                <template v-if="item.media.length > 1">
                  <div class="media-slider-pagination">
                    <span :key="key" v-for="(value, key) in item.media" :class=" [{ active: key === currentSlide }, 'item']" @click="currentSlide = key"></span>
                  </div>
                  <div class="media-slider-navigation">
                    <span :class="[{hidden: currentSlide === 0}, 'btn-prev']" @click="currentSlide -= 1"></span>
                    <span :class="[{hidden: currentSlide === item.media.length - 1}, 'btn-next']" class="" @click="currentSlide += 1"></span>
                  </div>
                </template>
            </div>
            <Actions :post="item"></Actions>
        </div>
        <AddComment></AddComment>
        <div class="postComments">
            <ShowMore></ShowMore>
            <div class="comments-list">
                <Comment></Comment>
                <Comment></Comment>
                <Comment></Comment>
                <Comment></Comment>
            </div>
        </div>
    </div>
</template>

<script>
import AddComment from "./comments/AddComment";
import ShowMore from "./comments/ShowMore";
import Comment from "./comments/Comment";
import PostHeader from "./PostHeader";
import Actions from "./Actions";
import LockedPicture from "./mediaContent/LockedPicture";
import Video from "./mediaContent/Video";
import Gif from "./mediaContent/Gif";
import Simple from "./mediaContent/Simple";

export default {
  name: "Post",
  data: function() {
    return {
      isShowPostDropdawn: false,
      currentSlide: 0
    };
  },
  components: {
    Comment,
    AddComment,
    ShowMore,
    Actions,
    PostHeader,
    LockedPicture,
    Video,
    Gif,
    Simple
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getMediaViewType(media) {
      switch (true) {
        case !media.canView:
          return "LockedPicture";
        case media.type === "video":
          return "Video";
        case media.type === "gif":
          return "Gif";
        default:
          return "Simple";
      }
    }
  }
};
</script>

<style scoped>
.add-new-type {
  font-size: 0;
  padding: 0 8px;
  position: relative;
}

@media (max-width: 992px) {
  .add-new-type {
    padding: 0;
    width: 100%;
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    z-index: 2;
  }
}

@media (max-width: 992px) {
  .mediasTop .add-new-type {
    box-shadow: none;
  }
}

@media (min-width: 992px) {
  .mediasTop .add-new-type {
    z-index: 2;
  }
}

@media (min-width: 992px) {
  .popup .add-new-type:not(.chat-new-type) {
    padding: 0 13px;
    position: absolute;
    left: 0;
    right: 0;
    top: -60px;
  }
}

.add-new-type__text {
  opacity: 0.5;
  line-height: 11px;
}

@media (min-width: 992px) {
  .add-new-type__text {
    opacity: 0.4;
  }
}

.add-new-type .addNewNav {
  display: flex;
  position: relative;
}

.add-new-type .addNewNav > a,
.add-new-type .addNewNav > span {
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--dark);
  position: relative;
}

@media (max-width: 992px) {
  .add-new-type .addNewNav > a,
  .add-new-type .addNewNav > span {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 992px) {
  .mediasTop .add-new-type .addNewNav > a,
  .mediasTop .add-new-type .addNewNav > span {
    height: 60px;
  }
}

.popup .add-new-type .addNewNav > a,
.popup .add-new-type .addNewNav > span {
  white-space: nowrap;
}

@media (min-width: 992px) {
  .popup .add-new-type .addNewNav > a,
  .popup .add-new-type .addNewNav > span {
    height: 60px;
  }
}

@media (max-width: 992px) {
  .add-new-type .addNewNav > a,
  .add-new-type .addNewNav > span {
    height: 44px;
  }
}

.add-new-type .addNewNav > a:before,
.add-new-type .addNewNav > span:before {
  font-weight: 400;
  opacity: 0.3;
  transition: color 0.3s ease, opacity 0.3s ease;
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 24px;
  width: 39px;
  color: var(--dark);
  display: block;
  flex: 0 0 100%;
  line-height: 26px;
}

.add-new-type .addNewNav > a.new-post:before,
.add-new-type .addNewNav > span.new-post:before {
  content: "\E623";
}

.add-new-type .addNewNav > a.new-story:before,
.add-new-type .addNewNav > span.new-story:before {
  content: "\E620";
}

.add-new-type .addNewNav > a.new-live:before,
.add-new-type .addNewNav > span.new-live:before {
  content: "\E621";
}

.add-new-type .addNewNav > a.new-message:before,
.add-new-type .addNewNav > span.new-message:before {
  content: "\E622";
}

.add-new-type .addNewNav > a.active,
.add-new-type .addNewNav > span.active {
  cursor: default;
}

.add-new-type .addNewNav > a.active:before,
.add-new-type .addNewNav > a:hover:before,
.add-new-type .addNewNav > span.active:before,
.add-new-type .addNewNav > span:hover:before {
  color: var(--primary-color);
  opacity: 1;
}

.add-new-type_underline-items a:after,
.add-new-type_underline-items span:after {
  content: "";
  position: absolute;
  left: 1px;
  right: 1px;
  height: 2px;
  background-color: var(--secondary-color);
  transition: opacity 0.3s ease;
  opacity: 0;
}

@media (max-width: 992px) {
  .add-new-type_underline-items a:before,
  .add-new-type_underline-items span:before {
    margin-top: 4px;
  }
}

.add-new-type_underline-items a.active:after,
.add-new-type_underline-items span.active:after {
  opacity: 1;
}

@media (max-width: 992px) {
  .add-new-type_underline-items a.active .add-new-type__text,
  .add-new-type_underline-items span.active .add-new-type__text {
    opacity: 1;
    color: var(--primary-color);
  }
}

.add-new-type_underline-items.line-top a:after,
.add-new-type_underline-items.line-top span:after {
  top: -12px;
}

@media (max-width: 992px) {
  .add-new-type_underline-items.line-top a:after,
  .add-new-type_underline-items.line-top span:after {
    top: auto;
    bottom: 0;
  }
}

@media (max-width: 992px) {
  .add-new-type_underline-items.line-top a:before,
  .add-new-type_underline-items.line-top span:before {
    margin-top: 4px;
  }
}

@media (max-width: 992px) {
  .add-new-type_underline-items.line-top a.active .add-new-type__text,
  .add-new-type_underline-items.line-top span.active .add-new-type__text {
    opacity: 1;
    color: var(--primary-color);
  }
}

.add-new-type_underline-items.line-bottom a:after,
.add-new-type_underline-items.line-bottom span:after {
  bottom: 0;
}

.add-new-type_b-with-text {
  font-size: 9px;
}

.add-new-type_b-with-text a,
.add-new-type_b-with-text span {
  align-content: flex-start;
}

@media (min-width: 992px) {
  .add-new-type_b-with-text a,
  .add-new-type_b-with-text span {
    text-align: center;
    justify-content: center;
  }
}

.add-new-type_b-with-text a:before,
.add-new-type_b-with-text span:before {
  display: block;
  flex: 0 0 100%;
}

@media (min-width: 992px) {
  .add-new-type_b-with-text a:before,
  .add-new-type_b-with-text span:before {
    margin-top: 10px;
  }
}

@media (min-width: 992px) {
  .mediasTop .add-new-type_b-with-text a:before,
  .mediasTop .add-new-type_b-with-text span:before {
    margin-top: 13px;
  }
}

@media (max-width: 992px) {
  .addPost {
    height: 100%;
    background: var(--white);
    margin-top: -44px;
    position: relative;
    z-index: 20;
  }
  #content > .addPost {
    transition: none;
  }
  .feed .addPost {
    display: none;
  }
}

@media (min-width: 992px) {
  .addPost {
    max-width: 940px;
    margin: 0 auto;
    padding: 0 10px;
  }
  .popup .addPost,
  .feed .addPost {
    padding: 0;
    max-width: none;
    margin: 0;
  }
}

@media (min-width: 992px) {
  .addPost-header {
    display: none;
  }
}

@media (max-width: 992px) {
  .addPost-header {
    display: flex;
    height: 87px;
    align-items: center;
    padding: 0 15px 43px 0;
    position: relative;
    z-index: 2;
    background: inherit;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
}

@media (max-width: 992px) {
  .addPost-header .go-back:before {
    content: "\E605";
  }
}

.addPost .add-new-form.expanded .add-new-type .addNewNav > a,
.addPost .add-new-form.expanded .add-new-type .addNewNav > span {
  font-size: 9px;
  text-align: center;
  justify-content: center;
  align-content: flex-start;
}

.popup .addPost .add-new-form.expanded .add-new-type .addNewNav > a:before,
.popup .addPost .add-new-form.expanded .add-new-type .addNewNav > span:before {
  margin-top: 5px;
}

@media (min-width: 992px) {
  .popup .addPost .add-new-form.expanded .add-new-type .addNewNav > a:before,
  .popup
    .addPost
    .add-new-form.expanded
    .add-new-type
    .addNewNav
    > span:before {
    margin-top: 12px;
  }
}

@media (max-width: 992px) {
  .addPost .add-new-form.expanded .add-new-type .addNewNav > a:before,
  .addPost .add-new-form.expanded .add-new-type .addNewNav > span:before {
    margin-top: 3px;
  }
}

.popup
  .addPost
  .add-new-form.expanded
  .add-new-type
  .addNewNav
  > a.active:before,
.popup
  .addPost
  .add-new-form.expanded
  .add-new-type
  .addNewNav
  > span.active:before {
  width: 54px;
}

.tweet-new-post {
  display: none;
  margin: 0 15px 0 0;
}

.add-new-form.expanded .tweet-new-post {
  display: block;
}

.tweet-new-post input {
  display: none;
}

.tweet-new-post .icon {
  color: var(--dark);
  opacity: 0.3;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.tweet-new-post .icon:before {
  font-weight: 400;
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 24px;
  width: 1.6em;
  content: "\E61F";
}

@media (max-width: 992px) {
  .tweet-new-post {
    position: absolute;
    top: 7px;
    right: 80px;
    z-index: 2;
  }
}

@media (min-width: 992px) {
  .tweet-new-post:hover .icon {
    color: var(--secondary-color);
    opacity: 1;
  }
}

.tweet-new-post input:checked + .icon {
  color: var(--secondary-color);
  opacity: 1;
}

.add-new-form {
  position: relative;
  background: var(--white);
}

@media (min-width: 992px) {
  .add-new-form {
    overflow: hidden;
    display: flex;
    padding: 15px 0 15px 60px;
    border-radius: 5px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  .popup .add-new-form {
    overflow: visible;
  }
}

.feed .add-new-form {
  border-radius: 5px 5px 0 0;
  box-shadow: none;
}

@media (max-width: 992px) {
  .feed .add-new-form {
    display: none;
  }
}

.popup .add-new-form {
  margin-top: 44px;
  border-radius: 0;
}

@media (min-width: 992px) {
  .popup .add-new-form {
    margin-top: 60px;
  }
}

.popup .add-new-form .add-new-type .addNewNav > a:after,
.popup .add-new-form .add-new-type .addNewNav > span:after {
  display: block;
  top: auto;
  bottom: 0;
  top: auto;
}

@media (min-width: 992px) {
  .popup .add-new-form .add-new-type .addNewNav > a.active .add-new-type__text,
  .popup
    .add-new-form
    .add-new-type
    .addNewNav
    > span.active
    .add-new-type__text {
    opacity: 1;
  }
}

@media (min-width: 992px) {
  .add-new-form {
    background: linear-gradient(
      30deg,
      var(--secondary-color-12) 10%,
      var(--primary-color-12) 90%
    );
  }
  .add-new-form.expanded {
    display: block;
  }
}

@media (max-width: 992px) {
  .add-new-form .avatar {
    display: none;
  }
}

@media (min-width: 992px) {
  .add-new-form .avatar {
    font-size: 30px;
    position: absolute;
    left: 15px;
    top: 15px;
  }
}

.add-new-form .avatar:before {
  box-shadow: none;
}

.add-new-form .addFileCollectionView {
  margin: 0 8px;
}

@media (max-width: 992px) {
  .add-new-form .addFileCollectionView {
    position: absolute;
    left: 0;
    right: 0;
    top: 180px;
  }
}

@media (min-width: 992px) {
  .add-new-form .addFileCollectionView:not(:empty) {
    border-top: 1px solid rgba(124, 139, 150, 0.2);
  }
}

.add-new-form .addFileCollectionView .addFileView {
  margin: 12px 8px 15px;
}

@media (min-width: 992px) {
  .add-new-form .addFileCollectionView .addFileView {
    margin: 14px 8px 15px;
  }
}

.add-new-form .text-media-container {
  transition: height 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  flex: 1;
}

@media (max-width: 992px) {
  .add-new-form .text-media-container {
    position: relative;
    overflow: visible;
  }
  .add-new-form .text-media-container:before {
    position: absolute;
    bottom: -1px;
    content: "";
    height: 1px;
    left: 15px;
    right: 15px;
    background: rgba(124, 139, 150, 0.2);
  }
}

@media (min-width: 992px) {
  .add-new-form .text-media-container {
    border-radius: 15px;
    background-color: var(--white);
  }
}

.add-new-form textarea {
  background-color: transparent;
  caret-color: var(--secondary-color);
}

@media (max-width: 992px) {
  .add-new-form textarea {
    font-size: 17px;
    padding: 21px 15px;
    height: 137px;
  }
}

@media (min-width: 992px) {
  .add-new-form textarea {
    height: 30px;
    overflow: hidden;
  }
}

.add-new-form textarea:focus {
  background-color: transparent;
}

.add-new-form .actions {
  display: flex;
  justify-content: space-between;
}

.add-new-form .add-media-input {
  color: var(--secondary-color);
  transition: color 0.3s ease;
}

.add-new-form .add-media-input:hover {
  color: var(--secondary-color-darken);
}

@media (min-width: 992px) {
  .add-new-form .add-media-input {
    position: absolute;
    top: 15px;
    right: 170px;
  }
}

.add-new-form .add-media-input:before {
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 24px;
  width: 2em;
  content: "\E61A";
  display: block;
}

@media (min-width: 992px) {
  .add-new-form .submit {
    padding-left: 21px;
    padding-right: 21px;
    display: none;
  }
}

.add-new-form .voting-block-toggle-btn {
  display: none;
  transition: color 0.3s ease;
  cursor: pointer;
  color: var(--secondary-color);
}

.add-new-form .voting-block-toggle-btn:hover,
.add-new-form .voting-block-toggle-btn.active {
  color: var(--secondary-color-darken);
}

.add-new-form .voting-block-toggle-btn:before {
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 24px;
  width: 1.5em;
  display: block;
  content: "\E624";
}

.add-new-form:not(.expanded) .add-new-type .addNewNav > a,
.add-new-form:not(.expanded) .add-new-type .addNewNav > span {
  width: 39px;
}

.add-new-form:not(.expanded) .add-new-type .addNewNav > a:after,
.add-new-form:not(.expanded) .add-new-type .addNewNav > span:after {
  display: none;
}

@media (min-width: 992px) {
  .add-new-form.expanded {
    padding: 15px 15px 10px 60px;
  }
  .add-new-form.expanded .text-media-container {
    border-radius: 6px;
    box-shadow: 0 0 0 2px var(--secondary-color-20);
  }
}

@media (min-width: 992px) {
  .popup .add-new-form.expanded {
    padding-bottom: 15px;
  }
}

.add-new-form.expanded textarea {
  overflow: auto;
  max-height: 200px;
}

@media (max-width: 992px) {
  .add-new-form.expanded textarea {
    height: 137px;
  }
}

@media (min-width: 992px) {
  .add-new-form.expanded textarea {
    height: 80px;
  }
}

@media (min-width: 992px) {
  .popup .add-new-form.expanded textarea {
    height: 80px;
  }
}

.add-new-form.expanded .add-media-input {
  position: static;
  margin-right: 7px;
}

.add-new-form.expanded .add-media-input:before {
  width: 1.8em;
}

@media (min-width: 992px) {
  .add-new-form.expanded .add-media-input:before {
    width: 1.1em;
  }
}

.add-new-form.expanded .add-new-type {
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 992px) {
  .add-new-form.expanded .add-new-type {
    margin-top: -3px;
    transform: translateX(7px);
  }
}

@media (min-width: 992px) {
  .add-new-form.expanded .add-new-type .addNewNav > a:before,
  .add-new-form.expanded .add-new-type .addNewNav > span:before {
    width: 1.8em;
  }
}

@media (min-width: 992px) {
  .add-new-form.expanded .add-new-type .addNewNav > a.active,
  .add-new-form.expanded .add-new-type .addNewNav > span.active {
    margin: 0 8px 0 0;
  }
  .popup .add-new-form.expanded .add-new-type .addNewNav > a.active,
  .popup .add-new-form.expanded .add-new-type .addNewNav > span.active {
    margin: 0;
  }
}

@media (min-width: 992px) and (min-width: 992px) {
  .add-new-form.expanded .add-new-type .addNewNav > a.active:before,
  .add-new-form.expanded .add-new-type .addNewNav > span.active:before {
    width: 54px;
  }
}

@media (min-width: 992px) {
  .popup .add-new-form.expanded .add-new-type {
    margin-top: 0;
    transform: translateX(0);
  }
}

@media (min-width: 992px) {
  .popup .add-new-form.expanded .add-new-type .addNewNav > span {
    margin-left: 4px;
    flex: 0 0 72px;
  }
}

@media (min-width: 992px) {
  .popup .add-new-form.expanded .add-new-type .addNewNav > span:before {
    width: auto;
  }
}

.popup .add-new-form.expanded .tweet-new-post {
  margin-left: auto;
}

.add-new-form.expanded .submit {
  display: block;
}

.add-new-form.expanded .actions {
  padding: 12px 5px 0;
}

@media (min-width: 992px) {
  .add-new-form.expanded .actions {
    padding: 15px 0 0;
  }
}

.add-new-form.expanded .voting-block-toggle-btn {
  display: block;
}

.actions-controls {
  display: flex;
  align-content: center;
  align-items: center;
}

.b-check-state {
  font-size: 13px;
  line-height: 29px;
}

@media (min-width: 992px) {
  .b-check-state {
    margin-left: 8px;
  }
}

.add-new-form:not(.expanded) .b-check-state {
  display: none;
}

.b-check-state input[type="checkbox"] {
  position: absolute;
  left: -999em;
  top: 0;
  visibility: hidden;
  opacity: 0;
}

.b-check-state input[type="checkbox"]:checked + .b-check-state__icon {
  opacity: 1;
}

.b-check-state input[type="checkbox"]:checked + .b-check-state__icon:before {
  opacity: 0;
}

.b-check-state input[type="checkbox"]:checked + .b-check-state__icon:after {
  opacity: 1;
}

.b-check-state
  input[type="checkbox"]:checked
  + .b-check-state__icon
  + .b-check-state__text {
  opacity: 1;
}

.b-check-state__icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  position: relative;
  opacity: 0.5;
}

.b-check-state__icon:before,
.b-check-state__icon:after {
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 18px;
  height: 18px;
  line-height: 15px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 24px;
  transition: opacity 0.3s;
}

.b-check-state__icon:before {
  content: "\E610";
  opacity: 0.5;
  color: var(--dark);
}

.b-check-state__icon:after {
  content: "\E60F";
  color: var(--secondary-color);
  opacity: 0;
  transition: opacity 0.3s;
}

.b-check-state__text {
  margin-top: 1px;
  opacity: 0.5;
  white-space: nowrap;
}

.b-check-state label {
  cursor: pointer;
  display: flex;
  align-items: center;
  align-content: center;
}
</style>
