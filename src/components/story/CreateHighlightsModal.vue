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
                  :disabled="!hasChecked"
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
                    <div class="cover-highlight selected">
                      <img
                        src="https://storage.onmyteam.com/get/dev/files/9/96/96246c6396a462709066ae052895f93c/298x168_2d5c6a4c7698b3021ecbc73b0eb7bacc525083.jpg"
                        alt=""
                      />
                    </div>
                    <div class="cover-highlight">
                      <img
                        src="https://storage.onmyteam.com/get/dev/files/9/96/96246c6396a462709066ae052895f93c/298x168_2d5c6a4c7698b3021ecbc73b0eb7bacc525083.jpg"
                        alt=""
                      />
                    </div>
                    <div class="cover-highlight">
                      <img
                        src="https://storage.onmyteam.com/get/dev/files/9/96/96246c6396a462709066ae052895f93c/298x168_2d5c6a4c7698b3021ecbc73b0eb7bacc525083.jpg"
                        alt=""
                      />
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

                <VuePerfectScrollbar
                  class="popup-content-scroll"
                  v-if="step === 1"
                >
                  <div class="explore-wrapper highlights">
                    <div
                      v-for="story in stories"
                      :key="story.id"
                      class="explore-item explore-item_radio explore-item_col explore-item_col-4 liveView"
                      :class="{ selected: !!checked[story.id] }"
                      @click="check(story.id)"
                    >
                      <div class="timestamp timestamp_unit">
                        <div class="timestamp__date">
                          30
                        </div>
                        sep
                      </div>
                      <div class="postLink">
                        <figure class="explore-media">
                          <img :src="story.thumb.source" />
                        </figure>
                      </div>
                    </div>
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
// import dateFns from "date-fns";
import Modal from "@/components/modal/Index";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "CreateHighlightsModal",
  components: {
    Modal,
    VuePerfectScrollbar
  },
  data() {
    return {
      checked: {},
      step: 1,
      title: "",
      choosenCover: undefined
    };
  },
  computed: {
    stories() {
      return this.$store.state.stories.posts;
    },
    hasChecked() {
      return !!Object.keys(this.checked).length;
    }
  },
  methods: {
    check(id) {
      if (this.checked[id]) {
        this.checked = { ...this.checked, [id]: false };
      } else {
        this.checked = { ...this.checked, [id]: true };
      }
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "createHighlights" });
    },
    save() {
      alert(" SAVE ");
    }
  },
  created() {
    this.$store.dispatch("stories/setSource", { source: "archive" });
    this.$store.dispatch("stories/getPosts");
  },
  watch: {
    step() {
      if (this.step === 2) {
        this.choosenCover = Object.keys(this.checked)[0];
      }
    }
  }
};
</script>
