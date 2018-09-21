<template>
    <div class="feed">
        <div class="postCollectionView">
            <div class="posts">
                <Post></Post>
                <Post></Post>
                <Post></Post>
            </div>
            <div class="no-results-search">
                <div class="no-results-search__message">
                    <span class="no-results-search__text">Nothing found for</span> <span class="searchAllTag">""</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Post from "./post/Index";

export default {
  name: "CollectionView",
  components: {
    Post: Post
  }
};
</script>

<style>
.videoplayer {
  position: relative;
}

.videoplayer.clicked:after {
  opacity: 0;
  visibility: hidden;
}

.videoplayer:after {
  content: "\E661";
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: absolute;
  left: 15px;
  bottom: 10px;
  font-size: 40px;
  color: #fff;
  opacity: 0.8;
  transition: all 0.3s;
}

.posts .post {
  padding: 0 0 12px;
  border-bottom: 1px solid rgba(124, 139, 150, 0.2);
}

.posts .post:last-child {
  border-bottom: none;
}

.post.postPage .media img.locked {
  height: 50vh;
}

.post .post-header {
  display: flex;
  align-items: center;
  position: relative;
}

@media (max-width: 992px) {
  .post .post-header {
    margin: 0 15px;
    padding: 15px 32px 8px 0;
  }
}

@media (min-width: 992px) {
  .post .post-header {
    padding: 14px 50px 14px 15px;
  }
}

.post .post-header .avatar {
  font-size: 30px;
  flex: 0 0 30px;
  margin: 0 10px 0 0;
}

.post .post-header .user-login {
  margin-left: 5px;
}

@media (min-width: 992px) {
  .post .post-header .user-login {
    font-size: 15px;
  }
}

.post .text {
  padding: 0 15px 4px;
}

@media (min-width: 992px) {
  .post .text {
    padding: 0 15px 2px;
  }
}

.post .text:empty {
  display: none;
}

.post .media {
  margin: 7px 0 0;
  position: relative;
  overflow: hidden;
}

.post .media img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  background: #fff;
}

.postCollectionView .post .media img.locked {
  height: 50vh;
}

.post .media video {
  width: 100%;
  max-height: calc(100vh - 100px);
  display: block;
}

@media (min-width: 992px) {
  .postCollectionView .post .media video {
    max-height: calc(100vh - 200px);
  }
}

.post .media .media-slider .media-item {
  display: none;
}

.post .media .media-slider .media-item.active {
  display: block;
}

.post .media .media-slider-pagination {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

@media (min-width: 992px) {
  .post .media .media-slider-pagination {
    bottom: 10px;
  }
}

.post .media .media-slider-pagination .item {
  width: 6px;
  height: 6px;
  margin: 0 3px;
  border-radius: 1000px;
  background: #fff;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.post .media .media-slider-pagination .item:before {
  position: absolute;
  left: -3px;
  right: -3px;
  top: -3px;
  bottom: -3px;
  content: "";
}

.post .media .media-slider-pagination .item.active,
.post .media .media-slider-pagination .item:hover {
  opacity: 1;
}

@media (max-width: 992px) {
  .post .media .media-slider-navigation {
    display: none;
  }
}

.post .media .media-slider-navigation .btn-prev,
.post .media .media-slider-navigation .btn-next {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 45px;
  color: #fff;
  font-size: 36px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.4));
}

.post .media .media-slider-navigation .btn-prev:before,
.post .media .media-slider-navigation .btn-next:before {
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.post .media .media-slider-navigation .btn-prev:hover,
.post .media .media-slider-navigation .btn-next:hover {
  opacity: 1;
}

.post .media .media-slider-navigation .btn-prev {
  left: 0;
}

.post .media .media-slider-navigation .btn-prev:before {
  content: "\E645";
}

.post .media .media-slider-navigation .btn-next {
  right: 0;
}

.post .media .media-slider-navigation .btn-next:before {
  content: "\E643";
}

.post .media-item {
  background: #fff;
}

.post .media .gif-player {
  position: relative;
}

.post .media .gif-player .gif-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}

.post .actions {
  padding: 10px 15px 8px;
  position: relative;
  font-weight: 500;
  display: flex;
  align-items: center;
}

@media (min-width: 992px) {
  .post .actions {
    padding: 13px 15px 8px;
  }
}

.post .actions .likes,
.post .actions .comments,
.post .actions .tips,
.post .actions .report {
  opacity: 0.3;
  display: inline-flex;
  align-items: center;
  margin: 0 25px 0 0;
  cursor: pointer;
  min-width: 54px;
  transition: color 0.3s ease, opacity 0.3s ease;
}

@media (min-width: 992px) {
  .post .actions .likes,
  .post .actions .comments,
  .post .actions .tips,
  .post .actions .report {
    min-width: 58px;
  }
  .post .actions .likes:hover,
  .post .actions .comments:hover,
  .post .actions .tips:hover,
  .post .actions .report:hover {
    opacity: 1;
    color: var(--primary-color);
  }
}

@media (max-width: 576px) {
  .post .actions .likes,
  .post .actions .comments,
  .post .actions .tips,
  .post .actions .report {
    margin: 0 10px 0 0;
  }
}

.post .actions .likes.active,
.post .actions .comments.active,
.post .actions .tips.active,
.post .actions .report.active {
  opacity: 1;
  color: var(--primary-color);
}

.post .actions .likes:before,
.post .actions .comments:before,
.post .actions .tips:before,
.post .actions .report:before {
  display: inline-block;
  font-family: team;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 24px;
  margin: 0 4px 0 0;
  width: 1.1em;
  font-weight: 400;
}

.post .actions .likes:before {
  content: "\E616";
}

.post .actions .comments:before {
  content: "\E617";
}

.post .actions .tips:before {
  content: "\E618";
}

.post .actions .report {
  opacity: 0.15;
}

.post .actions .report,
.post .actions .report:empty {
  margin: 0 0 0 auto;
}

.post .actions .report:before {
  content: "\E619";
}

.post .actions .date {
  margin-left: auto;
}

.post .date {
  padding: 0;
  opacity: 0.5;
  font-size: 13px;
  display: block;
  font-weight: 400;
}

.post .date a {
  color: inherit;
  transition: color 0.3s ease;
}

.post .date a:hover {
  color: var(--primary-color);
}

.post .load-more-comments {
  opacity: 0.5;
  display: block;
  cursor: pointer;
  margin: 0 15px;
}

.post .comment-form {
  display: flex;
  padding: 10px 15px 25px;
}

@media (min-width: 992px) {
  .post .comment-form {
    padding: 5px 15px 20px;
  }
  .post .comment-form .comment-btn {
    width: 80px;
    flex: 0 0 80px;
  }
}

.post .comment-form .comment-input {
  margin: 0 15px 0 0;
}

.post .tip-form {
  display: flex;
  padding: 10px 15px 25px;
}

@media (min-width: 992px) {
  .post .tip-form {
    padding: 5px 15px 20px;
  }
  .post .tip-form .btn {
    width: 100px;
    flex: 0 0 100px;
  }
}

.post .tip-form .tip-amount-input {
  text-align: center;
}

.post .tip-amount-field {
  flex: 1;
  margin: 0 15px;
}

.post .post-dropdown-menu-btn {
  position: absolute;
  right: -8px;
  top: 10px;
  width: 40px;
  height: 40px;
  opacity: 0.5;
  cursor: pointer;
}

@media (min-width: 992px) {
  .post .post-dropdown-menu-btn {
    right: 7px;
    top: 9px;
  }
}

.post .post-dropdown-menu-btn:before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 4px;
  width: 16px;
  background-image: radial-gradient(circle, var(--dark) 50%, transparent 50%);
  background-size: 6px 4px;
  background-position: 5px 0;
  opacity: 0.5;
  transition: all 0.3s;
}

.post .post-dropdown-menu-btn:hover:before {
  opacity: 1;
}

@media (min-width: 992px) {
  .post .dropdown-menu {
    right: 2px;
    margin-top: 3px;
    top: 100%;
  }
}

.post .btn-copy-link {
  animation: copy-link 0.5s;
  transition: color 0.3s ease;
}

.post .btn-copy-link.copied {
  animation: none;
}

.post .report {
  transition: color 0.3s ease;
}

@keyframes copy-link {
  0% {
    color: transparent;
  }
  100% {
    color: inherit;
  }
}

.comments-list {
  padding: 0 15px 9px;
}

@media (max-width: 992px) {
  .postPage .comments-list {
    padding-bottom: 53px;
  }
}

.comments-list .comment {
  padding: 8px 0 0;
}

.comments-list .comment .comment-body {
  padding-right: 35px;
}

.comments-list .comment .name {
  max-width: 55%;
  padding: 0 4px 0 0;
  float: left;
}

.disable-scroll-page .comments-list .comment .name {
  max-width: 55%;
}

@media (min-width: 992px) {
  .disable-scroll-page .comments-list .comment .name {
    max-width: 40%;
  }
}

.comments-list .comment .comment-text {
  display: inline;
  word-break: break-all;
}

.comments-list .comment .comment-footer {
  font-size: 11px;
  display: flex;
  padding: 2px 24px 3px 0;
}

.comments-list .comment .comment-footer > * {
  opacity: 0.5;
}

.comments-list .comment .comment-footer .date {
  padding: 0;
  font: inherit;
  margin-right: 20px;
}

.comments-list .comment .comment-footer .likes-count {
  margin-right: 20px;
}

.comments-list .comment .comment-footer .btn-reply {
  border: none;
  background: none;
  padding: 0;
  color: inherit;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.comments-list .comment .comment-footer .btn-reply:hover {
  opacity: 1;
  color: var(--secondary-color);
}

.new-post-toast {
  display: block;
  text-align: center;
  font-size: 13px;
  padding: 12px 0;
  cursor: pointer;
  color: var(--primary-color);
  background: linear-gradient(
    30deg,
    var(--secondary-color-20) 10%,
    var(--primary-color-20) 90%
  );
  position: relative;
}

.new-post-toast:before {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  content: "";
  background: var(--light);
  opacity: 0.3;
}

.new-post-toast span {
  position: relative;
}

@media (min-width: 992px) {
  .new-post-toast {
    padding: 7px 0;
  }
}

.guest-comments-form {
  padding-top: 5px;
  padding-bottom: 8px;
  margin-left: 15px;
  margin-right: 15px;
  border-top: 1px solid rgba(124, 139, 150, 0.2);
}

@media (min-width: 992px) {
  .guest-comments-form {
    padding-top: 15px;
    padding-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
}

.guest-comments-form p {
  padding-bottom: 4px;
}

@media (min-width: 992px) {
  .guest-comments-form p {
    padding-bottom: 0;
  }
}

@media (min-width: 992px) {
  .guest-comments-form .date {
    white-space: nowrap;
  }
}
</style>
