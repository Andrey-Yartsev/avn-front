<template>
  <Modal :onClose="close" :path="path" :extraClassName="extraClassName">
    <template slot="content">
      <div class="popup-container post post-popup">
        <div
          class="content"
          :class="{ 'content_column-mob': $mq === 'mobile' }"
        >
          <div class="postPageWrapper postPageWrapper_in-popup">
            <MediaLarge
              v-if="post"
              :post="post"
              :from="backFrom || from"
              v-on:addExtraClassName="addExtraClassName"
            />
          </div>
        </div>
        <button
          type="button"
          class="close close_default icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import MediaLarge from "@/components/common/profile/media/views/MediaLarge";
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "MediaModal",
  components: {
    Modal,
    MediaLarge
  },
  mixins: [ModalRouterGoto],
  data() {
    return {
      index: undefined,
      extraClassName: "lightbox-post scroll-post",
      backFrom: undefined,
      preloadedImageIndexes: {},
      post: null
    };
  },
  computed: {
    from() {
      return this.$store.state.modalRouter.params.from;
    },
    postId() {
      return parseInt(this.$store.state.modalRouter.params.postId);
    },
    path() {
      return `media/${this.postId}`;
    }
  },
  methods: {
    addExtraClassName(className) {
      this.extraClassName = className;
    },
    init() {
      const existedPost = this.$store.state.profile.media.media.find(
        item => item.productId === this.postId
      );
      if (existedPost) {
        this.post = existedPost;
      } else {
        this.$store
          .dispatch(
            "profile/media/getMediaItemForModal",
            {
              productId: this.postId
            },
            { root: true }
          )
          .then(res => {
            this.post = res;
          });
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
