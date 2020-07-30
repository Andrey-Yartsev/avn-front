<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <div class="media-wrapper">
      <img
        :src="src"
        @load="() => (loaded = true)"
        @contextmenu.prevent="() => false"
        @dragstart.prevent="() => false"
      />
    </div>
  </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";
import Loader from "@/components/common/Loader";

export default {
  name: "Photo",
  mixins: [PostMediaPropsMixin],
  props: {
    post: Object,
    authorId: Number,
    autoplay: Boolean,
    media: Object,
    showPreview: Boolean,
    isAuthor: Boolean,
    openModal: Function
  },
  components: {
    Loader
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    media() {
      this.video = undefined;
      setTimeout(() => {
        this.video = this.media.src;
      }, 100);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.video-content {
  width: 100%;
  height: 360px;
  margin: auto;
  &.halfHeight {
    height: 50vh !important;
  }
}
.previewLoader {
  height: 300px;
  width: 620px !important;
  margin: auto !important;
}
.previewLoaderMobile {
  width: 100vw !important;
}
</style>
