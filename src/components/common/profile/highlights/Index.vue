<template>
  <div
    class="stories-wrapper stories-collection"
    v-if="posts.length || isOwner(userId)"
  >
    <div
      class="storyCollectionView storyCollectionView_col storyCollectionView_tape"
    >
      <div class="stories-collection__header">
        <h4>Highlights</h4>
        <!--<button class="btn-watch-all hidden-desktop" type="button">-->
        <!--Watch All-->
        <!--</button>-->
      </div>
      <div class="stories-group">
        <VuePerfectScrollbar @ps-scroll-y="scrollFunction">
          <div class="stories">
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
            <div class="story" v-for="post in posts" :key="post.id">
              <router-link
                class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                :to="`collections/${post.id}`"
              >
                <span class="avatar__img">
                  <img :src="post.cover" />
                </span>
              </router-link>
              <div class="story-info">
                <div class="story-header">
                  <router-link :to="`collections/${post.id}`" class="name">
                    {{ post.title }}
                  </router-link>
                </div>
                <div class="amount-items">{{ post.storiesCount }} items</div>
              </div>
            </div>
          </div>
        </VuePerfectScrollbar>
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
    userId: {
      type: Number,
      required: true
    }
  },
  computed: {
    posts() {
      return this.$store.state.highlights.posts;
    },
    loading() {
      return this.$store.state.highlights.loading;
    },
    allDataReceived() {
      return this.$store.state.highlights.allDataReceived;
    }
  },
  methods: {
    addNew() {
      this.$store.dispatch("modal/show", {
        name: "createHighlights"
      });
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("highlights/getPosts");
      }
    }
  },
  created() {
    this.$store.commit("highlights/resetPageState");
    this.$store.dispatch("highlights/setSource", { source: this.userId });
    this.$store.dispatch("highlights/getPosts");
  },
  beforeDestroy() {}
};
</script>
