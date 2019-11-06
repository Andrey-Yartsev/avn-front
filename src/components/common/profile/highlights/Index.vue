<template>
  <div
    class="stories-wrapper stories-collection"
    v-if="posts.length || isOwner(userId)"
  >
    <div
      class="storyCollectionView storyCollectionView_col storyCollectionView_tape b-toggled"
      :class="{ 'state-toggled': toggled }"
    >
      <div
        class="stories-collection__header b-toggled__header"
        @click="toggledBlock"
      >
        <h4>Highlights</h4>
      </div>
      <div class="b-toggled__content">
        <div class="stories-group">
          <perfect-scrollbar @ps-scroll-y="scrollFunction">
            <div class="stories">
              <a href="#" class="story btn-add-story" v-if="isOwner(userId)">
                <div
                  class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                  @click.prevent="addNew"
                >
                  <div class="round-add icn-item"></div>
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
                <a
                  :href="`collections/${post.id}`"
                  class="avatar avatar_lg-tab avatar_gap-r-md avatar_gap-r-md_reset-mob"
                  @click.prevent="open(post)"
                >
                  <span class="avatar__img">
                    <img :src="post.cover" />
                  </span>
                </a>
                <div class="story-info">
                  <div class="story-header">
                    <a
                      :href="`collections/${post.id}`"
                      @click.prevent="open(post)"
                      class="name"
                    >
                      {{ post.title }}
                    </a>
                  </div>
                  <div class="amount-items">{{ post.storiesCount }} items</div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";

export default {
  name: "Highlights",
  mixins: [UserMixin],
  data() {
    return {
      toggled: false
    };
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
    },
    open(post) {
      if (!post.canLookStory) {
        this.$store.dispatch("subscription/openSubscribeModal", post.user);
        return;
      }
      this.$router.push(`collections/${post.id}`);
    },
    toggledBlock() {
      this.toggled = !this.toggled;
    }
  },
  created() {
    this.$store.commit("highlights/resetPageState");
    this.$store.dispatch("highlights/setSource", { source: this.userId });
    if (this.user) {
      this.$store.dispatch("highlights/getPosts");
    }
  },
  beforeDestroy() {}
};
</script>
