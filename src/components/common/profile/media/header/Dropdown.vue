<template>
  <div class="more-functions__dropdown-inside">
    <ul v-if="isAuthor" class="more-functions__list">
      <li
        v-if="$mq === 'mobile'"
        class="more-functions__details more-functions__item"
      >
        <button @click.prevent="detailView" class="more-functions__link">
          <span class="more-functions__option">Details</span>
        </button>
      </li>
      <li class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="copyLink"
        >
          <span class="more-functions__option"
            >Copy link to {{ mediaType }}</span
          >
        </a>
      </li>
      <li class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="editPost"
        >
          <span class="more-functions__option">Edit {{ mediaType }}</span>
        </a>
      </li>
      <li class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="pinToggle"
        >
          <span class="more-functions__option">{{
            post.pinned ? `Pinned. Unpin ${mediaType}` : `Pin ${mediaType}`
          }}</span>
        </a>
      </li>
      <li class="more-functions__item">
        <button
          class="deletePost more-functions__link"
          type="button"
          @click="deletePost"
        >
          <span class="more-functions__option">Delete {{ mediaType }}</span>
        </button>
      </li>
    </ul>
    <ul v-else class="more-functions__list">
      <li class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="copyLink"
        >
          <span class="more-functions__option"
            >Copy link to {{ mediaType }}</span
          >
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";

export default {
  name: "MediaHeaderDropdown",
  mixins: [userMixin],
  props: {
    post: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    hide: {
      type: Function,
      required: true
    },
    isAuthor: Boolean
  },
  data: () => ({
    copied: false
  }),
  computed: {
    isOnPostPage() {
      return this.from === "postPage";
    },
    postId() {
      return this.post.productId;
    },
    userId() {
      return this.post.author.id;
    },
    mediaType() {
      return this.post.media.type;
    }
  },
  methods: {
    copyLink() {
      this.hide();
      this.$copyText(this.getVideoUrl()).then(() => {
        this.$store.dispatch(
          "global/flashToast",
          { text: "Link copied!" },
          {
            root: true
          }
        );
      });
    },
    getVideoUrl() {
      const { protocol, port, hostname } = window.location;
      return (
        `${protocol}//${hostname}` +
        (port ? ":" + port : "") +
        `/media/${this.post.author.username}/${this.post.productId}`
      );
    },
    pinToggle() {
      this.hide();
      this.$store
        .dispatch("profile/media/updateMedia", this.getMediaData(), {
          root: true
        })
        .then(() => {
          console.log("updated");
        });
    },
    getMediaData() {
      const {
        active,
        title,
        text,
        price,
        free,
        thumbId,
        removeVideoPreview,
        pinned
      } = this.$props.post;
      const data = {
        media: {
          active,
          title,
          text,
          price,
          free,
          thumbId,
          removeVideoPreview,
          pinned: !pinned
        },
        productId: this.$props.post.productId
      };
      return data;
    },
    async deletePost() {
      this.hide();
      this.$store
        .dispatch("profile/media/deleteMedia", this.postId, { root: true })
        .then(() => {
          if (this.$route.hash) {
            this.$router.push(`/${this.user.username}/media`);
          }
        })
        .catch(res => {
          console.log("failed", res);
        });
    },
    editPost() {
      this.hide();

      this.$store.commit("profile/media/startEditMedia", this.postId, {
        root: true
      });

      if (this.isOnPostPage) {
        this.$router.push("/media/edit/" + this.postId);
      } else {
        this.$store.dispatch("modal/show", {
          name: "editMedia",
          data: {
            postId: this.postId
          }
        });
      }
    }
  }
};
</script>
