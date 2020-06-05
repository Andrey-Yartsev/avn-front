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
                <div class="loader-infinity" v-if="infinityScrollLoading">
                  <Loader
                    :fullscreen="false"
                    :inline="true"
                    text=""
                    :small="true"
                  />
                </div>
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
  name: "ClipLikesModal",
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
      return this.$store.state.clipLikes.likes;
    },
    postId() {
      return this.$store.state.modal.clipLikes.data.postId;
    },
    store() {
      return this.$store.state.clipLikes;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "clipLikes" });
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (
        scrolledEnought &&
        !this.infinityScrollLoading &&
        !this.allDataReceived
      ) {
        this.infinityScrollGetDataMethod();
      }
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("clipLikes/fetchUsers", { postId: this.postId });
    }
  },
  mounted() {
    this.$store.commit("clipLikes/reset");
    this.$store.dispatch("clipLikes/fetchUsers", { postId: this.postId });
  }
};
</script>
