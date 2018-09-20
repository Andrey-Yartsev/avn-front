<template>
    <div class="stories-wrapper">
        <div class="storyCollectionView">
            <h4>Stories</h4>
            <div class="stories-group">
                <div class="storyView create-story-button">
                    <div class="story">
                        <div class="story-avatar">
                            <a class="avatar new-story">
                                <img src="https://media.team2.retloko.com/files/f/fu/fuv/fuvehoth2zqjgua11c8akpdcxgr3dvvw1537170622/2afff3a23099780908097f84bc5da2fd_normal.jpeg">
                            </a>
                            <span class="btn-add"></span>
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
  name: "StoriesWrapper"
};
</script>

<style scoped>
.create-story-button {
  cursor: pointer;
}

.create-story-button .user-login a:before {
  display: none;
}

.create-story-button .btn-add {
  position: absolute;
  right: -2px;
  bottom: -5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  background-color: var(--primary-color);
  border: 2px solid var(--white);
  z-index: 2;
  font-size: 14px;
}

.create-story-button input[type="file"] {
  pointer-events: none;
}

@media (min-width: 992px) {
  .stories-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

@media (min-width: 992px) {
  .stories-group {
    padding-bottom: 5px;
    margin-top: 10px;
    padding-left: 5px;
    flex: 1;
    overflow: hidden !important;
  }
}

@media (max-width: 992px) {
  .stories-group {
    display: flex;
    overflow: hidden !important;
    padding: 9px 20px 6px;
    margin: 0 -15px;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }
  .stories-group .os-content-glue,
  .stories-group .os-scrollbar {
    display: none;
  }
  .stories-group .os-viewport,
  .stories-group .os-padding {
    position: static;
  }
  .stories-group .os-content {
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}

.storyCollectionView {
  padding: 3px 0 0;
  position: relative;
  margin: 8px 15px 0;
}

@media (min-width: 992px) {
  .storyCollectionView {
    margin: 0 15px 0 0;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

.storyCollectionView .btn-watch-all {
  position: absolute;
  right: 0;
  top: 3px;
  background: none;
  border: none;
  padding: 0;
  color: var(--secondary-color);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.storyCollectionView .btn-watch-all:hover {
  color: var(--secondary-color-darken);
}

@media (max-width: 992px) {
  .storyCollectionView .stories {
    display: flex;
  }
  .storyCollectionView .stories .story {
    margin-right: 23px;
    width: 56px;
  }
}

@media (max-width: 992px) {
  .storyCollectionView .storyView {
    display: flex;
    margin-top: 0;
  }
}

@media (max-width: 992px) {
  .storyCollectionView .storyView.create-story-button {
    margin: 0;
  }
}

.storyCollectionView .storyView.create-story-button .user-login a {
  transition: color 0.3s ease;
}

.storyCollectionView .storyView.create-story-button .user-login a:hover {
  color: var(--primary-color-darken);
}

.storyCollectionView .story {
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  padding: 10px 20px 10px 0;
}

@media (max-width: 992px) {
  .storyCollectionView .story {
    margin: 0 23px 0 0;
    flex-direction: column;
    padding: 0;
  }
}

.storyCollectionView .story-header {
  display: flex;
  align-items: center;
  margin: 0 0 3px;
}

@media (max-width: 992px) {
  .storyCollectionView .story-header .verified-user {
    display: none;
  }
}

.storyCollectionView .story-avatar {
  position: relative;
}

.storyCollectionView .story .avatar {
  position: relative;
  font-size: 50px;
  flex: none;
}

.storyCollectionView .story-info {
  width: 100%;
  margin-left: 15px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 992px) {
  .storyCollectionView .story-info {
    margin-left: 0;
    max-width: 65px;
    text-align: center;
  }
}

.storyCollectionView .story .name {
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
}

@media (max-width: 992px) {
  .storyCollectionView .story .name {
    width: 100%;
    font-size: 11px;
    margin-top: 10px;
  }
}

.storyCollectionView .story-timestamp {
  font-size: 13px;
  opacity: 0.5;
  padding-left: 20px;
  margin-left: auto;
}

@media (max-width: 992px) {
  .storyCollectionView .story-timestamp {
    display: none;
  }
}

.storyCollectionView .story .user-login {
  display: flex;
  align-content: center;
  align-items: center;
  margin-left: 0;
}

@media (max-width: 992px) {
  .storyCollectionView .story .user-login {
    display: none;
  }
}

.storyCollectionView .followme {
  background: rgba(124, 139, 150, 0.08);
  border-radius: 1000px;
  font-size: 9px;
  line-height: 12px;
  padding: 0 5px;
  margin: 2px 0 0 4px;
  display: inline-block;
  vertical-align: top;
}

.storyCollectionView .followme__txt {
  opacity: 0.5;
}

.stories-collection {
  flex: 0 0 100%;
  max-width: 100%;
  background: var(--white)
    linear-gradient(
      30deg,
      var(--secondary-color-06) 10%,
      var(--primary-color-06) 90%
    )
    fixed;
  position: relative;
  overflow: hidden;
  display: none;
}

@media (min-width: 992px) {
  .stories-collection {
    padding-left: 15px;
    padding-right: 15px;
    background: none;
  }
}

.stories-collection:after {
  content: "";
  position: absolute;
  left: -7px;
  right: -7px;
  top: -7px;
  bottom: 0;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.15) inset;
  z-index: 0;
}

@media (min-width: 992px) {
  .stories-collection:after {
    display: none;
  }
}

.stories-collection .storyCollectionView {
  position: relative;
  z-index: 2;
}

.stories-collection .storyCollectionView .stories {
  margin-left: auto;
  margin-right: auto;
}

.stories-collection .storyCollectionView .stories .story {
  margin-left: 12px;
  margin-right: 12px;
}

@media (min-width: 992px) {
  .stories-collection .storyCollectionView .stories .story {
    margin-left: 0;
    margin-right: 0;
  }
}

@media (max-width: 992px) {
  .stories-collection .storyCollectionView .stories .name {
    font-size: 12px;
  }
}

@media (min-width: 992px) {
  .stories-collection .storyCollectionView .stories .name {
    font-weight: 500;
  }
}

@media (max-width: 992px) {
  .stories-collection .stories-group {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 992px) {
  .stories-collection .amount-items {
    display: none;
  }
}

.amount-items {
  opacity: 0.5;
  font-size: 13px;
}
</style>
