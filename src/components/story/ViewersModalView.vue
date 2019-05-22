<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-storyviewers">
        <div class="content content_relative">
          <div class="storyviewers-controls">
            <button
              class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
              @click.prevent="close"
            ></button>
            <a
              v-if="!fromCollection"
              @click.prevent="addToHighlights"
              class="btn-story-details hidden-mobile"
            />
            <router-link to="/settings/story" class="btn-settings" />
          </div>
          <div class="stories-list-preview">
            <swiper :options="swiperOption" key="viewerModalView" ref="swiper">
              <swiper-slide v-for="(story, key) in stories" :key="key">
                <div class="story-preview">
                  <img :src="story.preview.source" />
                  <div class="amount-viewers">
                    <span class="icn-viewer icn-item" />{{ story.viewersCount }}
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="container-story-details">
            <div class="container-story-details__inside">
              <div class="header-story-details">
                <div class="amount-viewers">
                  <span class="icn-viewer icn-item" />{{ current.viewersCount }}
                </div>
                <div class="story-time-created">
                  {{ dateTime }}
                </div>
                <div class="controls-story">
                  <a
                    href="#"
                    class="controls-story__btn"
                    @click.prevent="saveFile"
                  >
                    <span class="icn-download icn-item" />
                  </a>
                  <a
                    href="#"
                    class="controls-story__btn"
                    @click.prevent="share"
                  >
                    <span class="icn-share icn-item" />
                  </a>
                  <a
                    href="#"
                    class="controls-story__btn controls-story__btn_remove"
                    @click.prevent="deleteStory"
                  >
                    <span class="icn-remove icn-item" />
                  </a>
                </div>
              </div>
              <div class="body-story-details">
                <div class="list-viewers">
                  <VuePerfectScrollbar @ps-scroll-y="scrollFunction">
                    <div
                      class="viewer-row"
                      v-for="user in viewers"
                      :key="user.id"
                    >
                      <span class="avatar avatar_gap-r-sm avatar_sm">
                        <span class="avatar__img">
                          <img v-if="user.avatar" :src="user.avatar" />
                        </span>
                      </span>
                      <div class="username-group">
                        <span class="name">{{ user.name }}</span>
                        <div class="user-login reset-ml">
                          <span class="username">{{ user.username }}</span>
                        </div>
                      </div>
                      <a
                        href="#"
                        class="btn-block"
                        :class="{ active: user.isBlockedStory }"
                        @click.prevent="
                          user.isBlockedStory
                            ? unblockUser(user.id)
                            : blockUser(user.id)
                        "
                      >
                        <span class="icn-block icn-item"></span>
                      </a>
                    </div>
                  </VuePerfectScrollbar>
                </div>
                <div
                  class="msg-no-content"
                  :class="{ show: !loading && !viewers.length }"
                >
                  <div class="msg-no-content__text">
                    No one has seen this yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="close close_light" @click="close"></button>
      </div>
    </template>
  </Modal>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import Modal from "@/components/modal/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "StoryViewers",
  components: {
    Modal,
    VuePerfectScrollbar
  },
  data() {
    const self = this;
    const {
      currIndex,
      fromCollection
    } = this.$store.state.modal.storyViewers.data;

    return {
      currIndex,
      fromCollection,
      swiperOption: {
        initialSlide: currIndex,
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true,
        slideActiveClass: "active",
        preloadImages: true,
        grabCursor: true,
        on: {
          transitionEnd() {
            self.currIndex = this.activeIndex;
          },
          imagesReady() {
            if (self.swiper) {
              self.swiper.slideTo(this.currIndex);
            }
          }
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.swiper.swiper;
    },
    stories() {
      return this.$store.state.modal.storyViewers.data.stories;
    },
    current() {
      return this.stories[this.currIndex];
    },
    viewers() {
      return this.$store.state.viewers.posts;
    },
    dateTime() {
      return fromNow(this.current.createdAt);
    },
    loading() {
      return this.$store.state.viewers.loading;
    },
    allDataReceived() {
      return this.$store.state.viewers.allDataReceived;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "storyViewers" });
    },
    blockUser(userId) {
      this.$store.dispatch("viewers/blockUser", {
        storyId: this.current.id,
        userId
      });
    },
    unblockUser(userId) {
      this.$store.dispatch("viewers/unblockUser", {
        storyId: this.current.id,
        userId
      });
    },
    saveFile() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this.current.src.source, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement("a");
        tag.href = imageUrl;
        tag.download = "story";
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
      };
      xhr.send();
    },
    share() {
      this.$copyText(global.document.location.href);
    },
    deleteStory() {
      this.$store.dispatch("story/deletePost", {
        postId: this.current.id
      });

      this.$store.dispatch(
        "global/flashToast",
        { text: "Story deleted" },
        {
          root: true
        }
      );

      this.close();
    },
    addToHighlights() {
      this.$store.dispatch("modal/show", {
        name: "chooseHighlight",
        data: {
          storyId: this.current.id
        }
      });
    },
    init() {
      this.$store.dispatch("viewers/resetPageState");
      this.$store.dispatch("viewers/setSource", { source: this.current.id });
      this.$store.dispatch("viewers/getPosts");
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("viewers/getPosts");
      }
    }
  },
  created() {
    this.init();
  },
  watch: {
    currIndex() {
      this.init();
    }
  }
};
</script>
