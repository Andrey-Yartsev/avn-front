<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button class="header-return-btn"></button>
              <div class="page-title page-title_reset-gl">
                Highlight
              </div>
              <div class="btns-highlights">
                <button
                  class="btn sm"
                  v-if="step === 1"
                  :disabled="!checked.length"
                  @click="step = 2"
                >
                  Next
                </button>
                <button
                  class="btn alt sm"
                  v-if="step === 2"
                  :disabled="!title"
                  @click="save"
                >
                  Add
                </button>
              </div>
            </div>
            <div class="popup-body">
              <div class="popup-container-scroll">
                <div class="highlights-form" v-if="step === 2">
                  <!--<div class="avatar-block">-->
                  <!--<span class="avatar">-->
                  <!--<span class="avatar__img"></span>-->
                  <!--</span>-->
                  <!--<label for="avatar" class="select-user-image"></label>-->
                  <!--<input-->
                  <!--type="file"-->
                  <!--id="avatar"-->
                  <!--accept=".jpg,.jpeg,.gif,.png"-->
                  <!--/>-->
                  <!--<span class="reset-user-image reset-avatar"></span>-->
                  <!--</div>-->

                  <div class="title-block text-centered">
                    Choose cover picture
                  </div>
                  <div class="list-cover-variation">
                    <div
                      class="cover-highlight"
                      :class="{ selected: choosenCover == thumb.id }"
                      v-for="thumb in thumbs"
                      :key="thumb.id"
                      @click="choosenCover = thumb.id"
                    >
                      <img :src="thumb.thumb.source" alt="" />
                    </div>
                  </div>
                  <div class="form-group form-group_clear-gaps">
                    <input
                      name="name"
                      maxlength="100"
                      placeholder="Highlights"
                      class="text-centered lg"
                      v-model="title"
                    />
                  </div>
                </div>
                <div class="offer-create-story">
                  <a href="#" class="link-create-story">
                    <div class="avatar-block">
                      <span class="avatar avatar_ex-lg">
                        <span class="avatar__img"></span>
                      </span>
                      <span class="btn-add">
                        <svg aria-hidden="true" class="icn icn-plus">
                          <use xlink:href="#icon-plus-in-circle"></use>
                        </svg>
                      </span>
                    </div>
                    <div class="text-create-story">
                      Create new story
                    </div>
                  </a>
                </div>
                <VuePerfectScrollbar
                  class="popup-content-scroll"
                  v-if="step === 1"
                  @ps-scroll-y="scrollFunction"
                >
                  <div class="explore-wrapper highlights">
                    <div
                      v-for="story in stories"
                      :key="story.id"
                      class="explore-item explore-item_radio explore-item_col explore-item_col-4 liveView"
                      :class="{ selected: checked.indexOf(story.id) !== -1 }"
                      @click="check(story.id)"
                    >
                      <div class="timestamp timestamp_unit">
                        <div class="timestamp__date">
                          {{ formatDate(new Date(story.createdAt), "DD") }}
                        </div>
                        {{ formatDate(new Date(story.createdAt), "MMM") }}
                      </div>
                      <div class="postLink">
                        <figure class="explore-media">
                          <img v-if="story.thumb" :src="story.thumb.source" />
                        </figure>
                      </div>
                    </div>
                  </div>
                  <div class="loaderWrap loader-content" v-if="loading">
                    <Loader :fullscreen="false" />
                  </div>
                </VuePerfectScrollbar>
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
import Loader from "@/components/common/Loader";

export default {
  name: "CreateHighlightsModal",
  components: {
    Modal,
    VuePerfectScrollbar,
    Loader
  },
  data() {
    return {
      checked: [],
      step: 1,
      title: "",
      choosenCover: undefined
    };
  },
  computed: {
    loading() {
      return this.$store.state.stories.loading;
    },
    allDataReceived() {
      return this.$store.state.stories.allDataReceived;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    thumbs() {
      return this.$store.state.stories.posts.filter(post => {
        return this.checked.indexOf(post.id) !== -1;
      });
    }
  },
  methods: {
    formatDate: dateFns.format,
    check(id) {
      if (this.checked.indexOf(id) !== -1) {
        this.checked = this.checked.filter(el => el !== id);
      } else {
        this.checked = [...this.checked, id];
      }
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "createHighlights" });
    },
    save() {
      alert(" SAVE ");
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("stories/getPosts");
      }
    }
  },
  created() {
    this.$store.dispatch("stories/resetPageState");
    this.$store.dispatch("stories/setSource", { source: "archive" });
    this.$store.dispatch("stories/setLimit", { limit: 20 });
    this.$store.dispatch("stories/getPosts");
  },
  watch: {
    step() {
      if (this.step === 2) {
        this.choosenCover = this.checked[0];
      }
    }
  }
};
</script>
