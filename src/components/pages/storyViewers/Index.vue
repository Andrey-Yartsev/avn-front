<template>
  <div class="StoryPageCollectionView">

    <div class="popup">
      <div class="overlay"></div>
      <div class="popup-container storyviewers-popup">
        <div class="content">
          <div class="storyviewers-controls">
            <button class="header-return-btn"></button>
            <a href="#" class="btn-story-details hidden-mobile"></a>
            <a href="#" class="btn-settings"></a>
          </div>
          <div class="stories-list-preview">
              <div class="story-preview current">
                <img src="http://placehold.it/300x300" />
                <div class="amount-viewers">
                  <span class="icn-viewer icn-item"></span>
                  4
                </div>
              </div>
              <div class="story-preview">
                <img src="http://placehold.it/300x300" />
                <div class="amount-viewers">
                  <span class="icn-viewer icn-item"></span>
                  4
                </div>
              </div>
              <div class="story-preview">
                <img src="http://placehold.it/300x300" />
                <div class="amount-viewers">
                  <span class="icn-viewer icn-item"></span>
                  4
                </div>
              </div>
              <div class="story-preview">
                <img src="http://placehold.it/300x300" />
                <div class="amount-viewers">
                  <span class="icn-viewer icn-item"></span>
                  4
                </div>
              </div>
          </div>
          <div class="container-story-details">
            <div class="header-story-details">
              <div class="amount-viewers">
                <span class="icn-viewer icn-item"></span>
                4
              </div>
              <div class="story-time-created">
                2 hours
              </div>
              <div class="controls-story">
                <a href="#" class="controls-story__btn">
                  <span class="icn-download icn-item"></span>
                </a>
                <a href="#" class="controls-story__btn">
                  <span class="icn-share icn-item"></span>
                </a>
                <a href="#" class="controls-story__btn controls-story__btn_remove">
                  <span class="icn-remove icn-item"></span>
                </a>
              </div>
            </div>
            <div class="body-story-details">
              <div class="list-viewers">
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"><span class="avatar__img"></span></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"><span class="icn-block icn-item"></span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="close"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoryViewers"
};
</script>
