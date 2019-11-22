<template>
  <div
    :class="[
      'post',
      {
        'open-dropdown-inside': showDropdown,
        post_preparation: !post.isMediaReady,
        outofviewport: isVisible === false
      }
    ]"
    :data-id="post.id"
    :id="'p' + post.id"
    v-observe-visibility="visibilityChanged"
  >
    <div v-if="isVisible === false" :style="{ height: `${height}px` }" />
    <div class="post-wrapper" v-else>
      <div class="post-details">
        <Header
          :post="post"
          :from="from"
          @openDropdown="showDropdown = true"
          @hideDropdown="showDropdown = false"
          :showCopy="false"
        />
        <p
          class="text"
          :class="{ 'trunc-text': truncateText && !showTruncatedText }"
          v-html="getPostText()"
          ref="text"
        />
        <div class="trunc-toggle-btn" v-if="truncateText">
          <button @click="truncateToggle" class="trunc-toggle-link">
            {{ showTruncatedText ? "Collapse" : "More" }}
          </button>
        </div>
        <Media
          v-if="medias.length"
          :medias="medias"
          :shouldHasLink="!delayedPost"
          :post="post"
          :authorId="post.author.id"
          :openModal="openModal"
          mediaSize="preview"
        />
        <Actions
          :post="post"
          :showCopy="false"
          :from="from"
          :commentsBtnSelectable="false"
          :showAddCommentForm="false"
          :showTip="false"
          :openModal="openModal"
          @postShowCommentForm="() => {}"
          @postLike="() => {}"
          @toggleTip="() => {}"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/common/profile/media/header/Index";
import Media from "@/components/post/parts/media/Index";
import Actions from "@//components/common/profile/media/footer/Actions";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import MediaOpen from "@/mixins/media/open";

export default {
  name: "MediaMedium",
  mixins: [ModalRouterGoto, MediaOpen],
  data() {
    return {
      showDropdown: false,
      height: undefined,
      truncateText: false,
      showTruncatedText: false
    };
  },
  components: {
    Actions,
    Header,
    Media
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    medias() {
      if (!this.post.media.length) {
        return [];
      }
      return this.post.media;
    },
    isVisible() {
      return this.post.isVisible;
    }
  },
  methods: {
    visibilityChanged(isVisible, entry) {
      if (this.$mq === "desktop") {
        return;
      }
      this.$emit("visibilityChanged", {
        isVisible,
        id: parseInt(entry.target.id.replace(/p(\d+)/, "$1"))
      });
      this.height = entry.boundingClientRect.height;
    },
    truncateToggle() {
      this.showTruncatedText = !this.showTruncatedText;
    },
    getPostText() {
      return this.$props.post.text;
    },
    addHandlersToTags() {
      if (!this.$refs.text) {
        return;
      }
      const tags = [...this.$refs.text.querySelectorAll("[href^='/hashtag']")];
      tags.forEach(item => {
        item.addEventListener("click", this.tagEventListener);
      });
    },
    removeHandlersFromTags() {
      if (!this.$refs.text) {
        return;
      }
      const tags = [...this.$refs.text.querySelectorAll("[href^='/hashtag']")];
      tags.forEach(item =>
        item.removeEventListener("click", this.tagEventListener)
      );
    },
    tagEventListener(e) {
      e.preventDefault();
      const linkUrl = e.target.getAttribute("href");
      this.$router.push(linkUrl);
    }
  },
  mounted() {
    if (!this.$refs.text) {
      return;
    }
    if (this.$refs.text.getBoundingClientRect().height > 18 * 5 + 2) {
      this.truncateText = true;
    }
    this.addHandlersToTags();
  },
  beforeDestroy() {
    this.removeHandlersFromTags();
  }
};
</script>
