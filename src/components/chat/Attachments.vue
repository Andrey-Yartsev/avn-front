<template>
  <Loader v-if="firstLoading" :fullscreen="false" :inline="true" />
  <perfect-scrollbar v-else class="chat-att" @ps-scroll-y="psScrollHandle">
    <div v-if="!medias.length" class="no-items">
      No items
    </div>
    <template v-else>
      <template v-if="type === 'photo'">
        <div v-for="(v, k) in medias" :key="k" class="item">
          <AttachImage :media="v" v-if="v" />
        </div>
      </template>
      <div v-else class="item">
        <MediaVideo :message="items[0]" />
      </div>
    </template>
  </perfect-scrollbar>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScroll from "@/mixins/infinityScroll";
import AttachImage from "./media/AttachImage";
import MediaVideo from "./media/VideoPreview";

export default {
  name: "ChatAttachments",
  mixins: [InfinityScroll],
  components: {
    Loader,
    AttachImage,
    MediaVideo
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      firstLoading: true
    };
  },
  computed: {
    loading() {
      return this.$store.state.chat.attachments._fetchLoading;
    },
    items() {
      return this.$store.state.chat.attachments.list;
    },
    store() {
      return this.$store.state.chat.attachments;
    },
    medias() {
      const medias = [];
      this.items.forEach(item => {
        item.media.forEach(media => {
          medias.push(media);
        });
      });
      const n = medias.length % 3;
      if (n === 2) {
        medias.push(null);
      }
      return medias;
    }
  },
  methods: {
    psScrollHandle() {
      if (!this.loading && !this.allDataReceived) {
        this.infinityScrollGetDataMethod();
      }
    },
    infinityScrollGetDataMethod() {
      return this.$store.dispatch("chat/attachments/fetch", {
        type: this.type,
        userId: this.userId
      });
    }
  },
  watch: {
    userId() {
      this.$store.commit("chat/attachments/reset");
    },
    type() {
      this.$store.commit("chat/attachments/reset");
      this.firstLoading = true;
      this.infinityScrollGetDataMethod().then(() => {
        this.firstLoading = false;
      });
    }
  },
  mounted() {
    this.infinityScrollGetDataMethod().then(() => {
      this.firstLoading = false;
    });
  },
  beforeDestroy() {
    this.$store.commit("chat/attachments/reset");
  }
};
</script>