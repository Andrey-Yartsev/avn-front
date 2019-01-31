<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container storyviewers-popup">
        <div class="content">
          <div class="storyviewers-controls">
            <button class="header-return-btn" @click.prevent="close"></button>
            <a
              @click.prevent="addToHighlights"
              class="btn-story-details hidden-mobile"
            />
            <router-link to="/settings/story" class="btn-settings" />
          </div>
          <div class="stories-list-preview">
            <swiper :options="swiperOption">
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
                  <VuePerfectScrollbar>
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
                        @click.prevent="blockStoryFromUser"
                      >
                        <span class="icn-block icn-item"></span>
                      </a>
                    </div>
                  </VuePerfectScrollbar>
                </div>
                <div class="msg-no-content">
                  <div class="msg-no-content__text">
                    No one has seen this yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="close" @click="close"></button>
      </div>
    </template>
  </Modal>
</template>

<script>
import dateFns from "date-fns";
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
    const { currIndex } = this.$store.state.modal.storyViewers.data;

    return {
      currIndex,
      swiperOption: {
        initialSlide: currIndex,
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true,
        slideActiveClass: "active",
        grabCursor: true,
        on: {
          slideChange() {
            self.currIndex = this.activeIndex;
          }
        }
      }
    };
  },
  computed: {
    stories() {
      return this.$store.state.modal.storyViewers.data.stories;
    },
    current() {
      return this.stories[this.currIndex];
    },
    viewers() {
      return this.current.viewers;
    },
    dateTime: function() {
      return dateFns.distanceInWordsStrict(new Date(), this.current.createdAt);
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "storyViewers" });
    },
    blockStoryFromUser() {
      alert("Block story from user");
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
      alert();
    },
    deleteStory() {
      this.$store.dispatch("story/deletePost", {
        postId: this.current.id
      });

      this.$store.dispatch("global/flashToast", "Story deleted", {
        root: true
      });

      this.close();
    },
    addToHighlights() {
      alert("добавить в highlights");
    }
  }
};
</script>
