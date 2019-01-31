<template>
  <div class="stories-wrapper stories-collection" v-if="$mq === mqSize">
    <div
      class="storyCollectionView storyCollectionView_col storyCollectionView_tape"
    >
      <div class="stories-collection__header">
        <h4>Highlights</h4>
        <button class="btn-watch-all hidden-desktop" type="button">
          Watch All
        </button>
      </div>
      <div class="stories-group">
        <div class="stories">
          <VuePerfectScrollbar>
            <a href="#" class="story" v-if="isOwner(userId)">
              <div
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                @click.prevent="addNew"
              >
                <div class="round-add"></div>
              </div>
              <div class="story-info">
                <div class="story-header">
                  <div class="name">
                    Add new
                  </div>
                </div>
              </div>
            </a>
            <div class="story">
              <a
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                href="#"
              >
                <span class="avatar__img"></span>
              </a>
              <div class="story-info">
                <div class="story-header">
                  <a href="#" class="name">
                    Lorem
                  </a>
                  <div class="timestamp hidden-mobile">15 Jan</div>
                </div>
                <div class="amount-items">
                  4 items
                </div>
              </div>
            </div>
            <div class="story">
              <a
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                href="#"
              >
                <span class="avatar__img"></span>
              </a>
              <div class="story-info">
                <div class="story-header">
                  <a href="#" class="name">
                    Ipsum
                  </a>
                  <div class="timestamp hidden-mobile">16 Jan</div>
                </div>
                <div class="amount-items">
                  4 items
                </div>
              </div>
            </div>
            <div class="story">
              <a
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                href="#"
              >
                <span class="avatar__img"></span>
              </a>
              <div class="story-info">
                <div class="story-header">
                  <a href="#" class="name">
                    Lorem
                  </a>
                  <div class="timestamp hidden-mobile">15 Jan</div>
                </div>
                <div class="amount-items">
                  4 items
                </div>
              </div>
            </div>
            <div class="story">
              <a
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                href="#"
              >
                <span class="avatar__img"></span>
              </a>
              <div class="story-info">
                <div class="story-header">
                  <a href="#" class="name">
                    Ipsum
                  </a>
                  <div class="timestamp hidden-mobile">16 Jan</div>
                </div>
                <div class="amount-items">
                  4 items
                </div>
              </div>
            </div>
            <div class="story">
              <a
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                href="#"
              >
                <span class="avatar__img"></span>
              </a>
              <div class="story-info">
                <div class="story-header">
                  <a href="#" class="name">
                    Ipsum
                  </a>
                  <div class="timestamp hidden-mobile">16 Jan</div>
                </div>
                <div class="amount-items">
                  4 items
                </div>
              </div>
            </div>
          </VuePerfectScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "Highlights",
  mixins: [UserMixin],
  components: {
    VuePerfectScrollbar
  },
  props: {
    mqSize: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      required: true
    }
  },
  methods: {
    addNew() {
      this.$store.dispatch("modal/show", {
        name: "createHighlights"
      });
    }
  },
  created() {},
  beforeDestroy() {}
};
</script>
