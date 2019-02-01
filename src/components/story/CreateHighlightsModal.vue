<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="container-popup">
          <div class="content">
            <div class="popup-title">
              Highlight
            </div>
            <div class="popup-body">
              <div class="popup-container-scroll">
                <VuePerfectScrollbar class="popup-content-scroll">
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
      checked: {}
    };
  },
  computed: {
    stories() {
      return this.$store.state.stories.posts;
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
    }
  },
  created() {
    this.$store.dispatch("stories/setSource", { source: "archive" });
    this.$store.dispatch("stories/getPosts");
  }
};
</script>
