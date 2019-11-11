<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button
                class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                @click="close"
                v-if="$mq === 'mobile'"
              />
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
                  :disabled="!title.trim()"
                  @click="save"
                >
                  {{ isEditMode ? "Save" : "Add" }}
                </button>
              </div>
            </div>
            <div class="popup-body">
              <div class="popup-container-scroll">
                <div class="highlights-form" v-if="step === 2">
                  <div class="title-block text-centered">
                    Choose cover picture
                  </div>
                  <div class="list-cover-variation">
                    <div
                      class="highlight-unit"
                      v-for="thumb in thumbs"
                      :key="thumb.id"
                    >
                      <div
                        class="cover-highlight icn-item"
                        :class="{ selected: choosenCover == thumb.id }"
                        @click="choosenCover = thumb.id"
                      >
                        <img :src="thumb.thumb.source" alt="" />
                      </div>
                    </div>
                  </div>
                  <div class="form-group form-group_clear-gaps">
                    <input
                      name="name"
                      maxlength="70"
                      placeholder="Highlights"
                      class="text-centered lg"
                      :class="{ highlightsInput: !title.length }"
                      v-model="title"
                      ref="highlightsInput"
                    />
                  </div>
                </div>
                <div
                  class="offer-create-story"
                  v-if="step === 1 && !loading && !stories.length"
                >
                  <div
                    class="link-create-story"
                    @click.prevent="createNewStory"
                  >
                    <div class="avatar-block">
                      <span class="avatar avatar_ex-lg">
                        <span class="avatar__img"></span>
                      </span>
                      <span class="btn-add btn-add_lg-size">
                        <svg aria-hidden="true" class="icn icn-plus">
                          <use xlink:href="#icon-plus-in-circle"></use>
                        </svg>
                      </span>
                    </div>
                    <div class="text-create-story">
                      Create new story
                    </div>
                  </div>
                </div>
                <perfect-scrollbar
                  class="popup-content-scroll"
                  v-if="step === 1"
                  @ps-scroll-y="scrollFunction"
                >
                  <div class="explore-wrapper highlights" v-if="stories.length">
                    <div
                      v-for="story in stories"
                      :key="story.id"
                      class="explore-item explore-item_radio explore-item_col explore-item_col-4 liveView icn-item"
                      :class="{ selected: checked.indexOf(story.id) !== -1 }"
                      @click="check(story.id)"
                    >
                      <div class="timestamp timestamp_unit">
                        <div class="timestamp__date">
                          {{ moment(story.createdAt).format("DD") }}
                        </div>
                        {{ moment(story.createdAt).format("MMM") }}
                      </div>
                      <div class="postLink">
                        <figure class="explore-media">
                          <img
                            v-if="story.thumb"
                            :src="story.thumb.source"
                            @contextmenu.prevent="() => false"
                            @dragstart.prevent="() => false"
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                  <div class="loader-infinity" v-if="loading">
                    <Loader :fullscreen="false" :inline="true" :small="true" />
                  </div>
                </perfect-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="close close_shift-t close_shift-r close_default icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import moment from "moment";
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";

export default {
  name: "CreateHighlightsModal",
  components: {
    Modal,
    Loader
  },
  data() {
    const isEditMode = this.$store.state.modal.createHighlights.data.editMode;
    const collection = this.$store.state.modal.createHighlights.data.collection;
    return {
      checked: isEditMode ? collection.stories.map(el => el.id) : [],
      step: 1,
      title: isEditMode ? collection.title : "",
      choosenCover: isEditMode ? collection.coverStoryId : undefined,
      collection,
      isEditMode
    };
  },
  computed: {
    loading() {
      return this.$store.state.storiesArchive.loading;
    },
    allDataReceived() {
      return this.$store.state.storiesArchive.allDataReceived;
    },
    stories() {
      return this.$store.state.storiesArchive.posts;
    },
    thumbs() {
      return this.$store.state.storiesArchive.posts.filter(post => {
        return this.checked.indexOf(post.id) !== -1;
      });
    }
  },
  methods: {
    moment,
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
      this.close();
      this.$store
        .dispatch(`story/saveCollection`, {
          id: this.isEditMode ? this.collection.id : undefined,
          title: this.title,
          storyIds: this.checked,
          coverStoryId: this.choosenCover
        })
        .then(() => {
          global.document.location.reload();
        });
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("storiesArchive/getPosts");
      }
    },
    createNewStory() {
      this.close();
      document.getElementById("storyFileSelect").click();
    }
  },
  created() {
    this.$store.dispatch("storiesArchive/resetPageState");
    this.$store.dispatch("storiesArchive/getPosts");
  },
  watch: {
    step() {
      if (this.step === 2) {
        this.choosenCover = this.checked[0];
        this.$nextTick(() => {
          if (this.$refs.highlightsInput) {
            this.$refs.highlightsInput.focus();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.highlightsInput:not(:focus) {
  border: 1px solid red;
}
</style>
