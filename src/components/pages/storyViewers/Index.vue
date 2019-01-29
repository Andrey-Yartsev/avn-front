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
          <div
            class="stories-list-preview"
            :style="{ height: '300px', width: '100%' }"
          >
            <swiper :options="swiperOption">
              <swiper-slide v-for="(story, key) in stories" :key="key">
                <img
                  :src="story.thumb.source"
                  :style="{ 'max-width': '100%' }"
                />
              </swiper-slide>
            </swiper>
          </div>
          <div class="container-story-details">
            <div class="header-story-details">
              <div class="amount-viewers">
                <span class="icn-viewer icn-item" />{{ current.viewersCount }}
              </div>
              <div class="story-time-created">
                {{ dateTime }}
              </div>
              <div class="controls-story">
                <a href="#" class="controls-story__btn">
                  <span class="icn-download icn-item"></span>
                </a>
                <a href="#" class="controls-story__btn">
                  <span class="icn-share icn-item"></span>
                </a>
                <a
                  href="#"
                  class="controls-story__btn controls-story__btn_remove"
                >
                  <span class="icn-remove icn-item"></span>
                </a>
              </div>
            </div>
            <div class="body-story-details">
              <div class="list-viewers">
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
                </div>
                <div class="viewer-row">
                  <span class="avatar avatar_gap-r-sm avatar_sm"
                    ><span class="avatar__img"></span
                  ></span>
                  <div class="username-group">
                    <span class="name">OnMyTeam.com Support</span>
                    <div class="user-login reset-ml">
                      <span class="username">support</span>
                    </div>
                  </div>
                  <a href="#" class="btn-block"
                    ><span class="icn-block icn-item"></span
                  ></a>
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
import dateFns from "date-fns";

const stories = [
  {
    id: 2349,
    isExpired: false,
    createdAt: "2019-01-28T17:29:08+00:00",
    expiredAt: "2019-01-29T17:29:08+00:00",
    mediaType: "photo",
    fitType: "fit",
    isReady: true,
    isPinned: true,
    viewers: [],
    viewersCount: 0,
    src: {
      source:
        "https://storage.onmyteam.com/get/dev/files/f/fd/fd2f0c7f9b3bc42b684a1568377a64cb/208f472e00b22b86dc77d3fc6242622e763080.jpeg",
      width: 1920,
      height: 1440
    },
    preview: {
      source:
        "https://storage.onmyteam.com/get/dev/files/4/43/431b7def10147773fefd9c388ac2a976/760x570_208f472e00b22b86dc77d3fc6242622e763080.jpg",
      width: 760,
      height: 570
    },
    thumb: {
      source:
        "https://storage.onmyteam.com/get/dev/files/f/fc/fcb5fa1887269e645229042e66e9647d/440x440_208f472e00b22b86dc77d3fc6242622e763080.jpg",
      width: 440,
      height: 440
    },
    canComment: false,
    isLook: true
  },
  {
    id: 2350,
    isExpired: false,
    createdAt: "2019-01-28T17:30:15+00:00",
    expiredAt: "2019-01-29T17:30:15+00:00",
    mediaType: "photo",
    fitType: "fit",
    isReady: true,
    isPinned: true,
    viewers: [],
    viewersCount: 0,
    src: {
      source:
        "https://storage.onmyteam.com/get/dev/files/3/34/34388ad686904a0870ef0808a94686d1/481f84b381eb55a9b5ef9d7c5aaf450e656866.jpeg",
      width: 1100,
      height: 740
    },
    preview: {
      source:
        "https://storage.onmyteam.com/get/dev/files/b/bc/bc3d38d04ab3ed2d0ff5fde6c4a377a7/760x512_481f84b381eb55a9b5ef9d7c5aaf450e656866.jpg",
      width: 760,
      height: 512
    },
    thumb: {
      source:
        "https://storage.onmyteam.com/get/dev/files/c/cf/cf42e96fbedb230c21e81a56ed335d00/440x440_481f84b381eb55a9b5ef9d7c5aaf450e656866.jpg",
      width: 440,
      height: 440
    },
    canComment: false,
    isLook: true
  },
  {
    id: 2351,
    isExpired: false,
    createdAt: "2019-01-28T17:30:35+00:00",
    expiredAt: "2019-01-29T17:30:35+00:00",
    mediaType: "photo",
    fitType: "fit",
    isReady: true,
    isPinned: true,
    viewers: [],
    viewersCount: 0,
    src: {
      source:
        "https://storage.onmyteam.com/get/dev/files/c/c3/c31623699790d5c8fe7a33c2b4c94396/074d1c6bb1c5dd1d9d23d3e2c13b3a45401968.jpeg",
      width: 128,
      height: 128
    },
    preview: {
      source:
        "https://storage.onmyteam.com/get/dev/files/e/e4/e48d407b23ec59f42a0e915e8f00c44a/128x128_074d1c6bb1c5dd1d9d23d3e2c13b3a45401968.jpg",
      width: 128,
      height: 128
    },
    thumb: {
      source:
        "https://storage.onmyteam.com/get/dev/files/6/60/60fb89de8056d36d11bc9ec32ea1b352/440x440_074d1c6bb1c5dd1d9d23d3e2c13b3a45401968.jpg",
      width: 440,
      height: 440
    },
    canComment: false,
    isLook: true
  }
];
export default {
  name: "StoryViewers",
  data() {
    const self = this;

    return {
      activeSlide: 0,
      swiperOption: {
        autoHeight: true,
        initialSlide: 0,
        slidesPerView: stories.length > 4 ? 4 : stories.length,
        spaceBetween: 30,
        centeredSlides: true,
        slideToClickedSlide: true,
        // centerInsufficientSlides: true,
        on: {
          slideChange() {
            self.activeSlide = this.activeIndex;
          }
        }
      },
      stories
    };
  },
  computed: {
    current() {
      return this.stories[this.activeSlide];
    },
    dateTime: function() {
      return dateFns.distanceInWordsStrict(new Date(), this.current.createdAt);
    }
  }
};
</script>

<style scoped>
.swiper-slide {
  width: 60%;
}
.swiper-slide:nth-child(2n) {
  width: 40%;
}
.swiper-slide:nth-child(3n) {
  width: 20%;
}
</style>
