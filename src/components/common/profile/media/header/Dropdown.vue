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
      <li v-if="post.active" class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          @click.prevent="generateAccessLink"
        >
          <span class="more-functions__option">Create access link</span>
        </a>
      </li>
      <li v-if="post.active" class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          @click.prevent="openFreeAccessListModal"
        >
          <span class="more-functions__option">Free access list</span>
        </a>
      </li>
      <li v-if="post.active" class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          @click.prevent="openFreeAccessGroupsModal"
        >
          <span class="more-functions__option">Free group access</span>
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
    generateAccessLink() {
      this.hide();
      this.$store
        .dispatch("profile/media/generateAccessLink", this.post.productId, {
          root: true
        })
        .then(res => {
          const urlString = `${window.location.origin}/media/${
            this.$store.state.auth.user.username
          }/${this.post.productId}/${res.accessToken}`;
          this.$store.dispatch("modal/show", {
            name: "mediaAccessLink",
            data: {
              text: "Share this one-off link to give free access to the clip",
              linkUrl: urlString
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
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
    },
    openFreeAccessListModal() {
      this.hide();
      this.$store.dispatch("modal/show", {
        name: "freeAccessMediaList",
        data: {
          post: this.post
        }
      });
    },
    openFreeAccessGroupsModal() {
      this.hide();
      this.$store.dispatch("modal/show", {
        name: "freeAccessMediaGroups",
        data: {
          post: this.post
        }
      });
    }
  }
};
</script>
