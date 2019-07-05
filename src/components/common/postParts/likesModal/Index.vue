<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-likers">
        <div class="content content_column-mob">
          <div class="popup-title popup-title_underlined">Likes</div>
          <div class="popup-body">
            <div class="list-viewers">
              <perfect-scrollbar
                @ps-scroll-y="scrollFunction"
                :settings="{ suppressScrollX: true }"
                class="ps"
              >
                <Item v-for="user in users" :key="user.id" :user="user" />
              </perfect-scrollbar>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="close close_default close_visible-mob close_shift-t icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import Item from "./Item";
// import userMixin from "@/mixins/user";
import InfinityScrollData from "@/mixins/infinityScrollData";

export default {
  name: "PostLikesModal",
  mixins: [InfinityScrollData],
  components: {
    Modal,
    Loader,
    Item
  },
  data() {
    return {
      loadingName: "fetchLoading"
    };
  },
  computed: {
    users() {
      return this.$store.state.postLikes.likes;
    },
    postId() {
      return this.$store.state.modal.postLikes.data.postId;
    },
    loading() {
      return this.$store.state.postLikes.fetchLoading;
    },
    allDataReceived() {
      return this.$store.state.postLikes.allDataReceived;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "postLikes" });
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.$store.dispatch("postLikes/fetch", { postId: this.postId });
      }
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("postQueue/getPosts");
    }
  },
  mounted() {
    this.$store.commit("postLikes/reset");
    this.$store.dispatch("postLikes/fetch", { postId: this.postId });
  }
};
</script>
