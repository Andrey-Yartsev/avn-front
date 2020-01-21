<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li
        v-if="$mq === 'mobile'"
        class="more-functions__details more-functions__item"
      >
        <button @click.prevent="detailView" class="more-functions__link">
          <span class="more-functions__option">Details</span>
        </button>
      </li>
      <li v-if="isOwner(userId) && isAuth()" class="more-functions__item">
        <a
          class="edit more-functions__link"
          type="button"
          :href="'/post/edit/' + post.id"
          @click.prevent="editPost"
        >
          <span class="more-functions__option">Edit</span>
        </a>
      </li>
      <template v-if="isOwner(userId)">
        <li class="more-functions__item">
          <button
            class="deletePost more-functions__link"
            type="button"
            @click="deletePost"
          >
            <span class="more-functions__option">Delete</span>
          </button>
        </li>
      </template>
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
    }
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
    }
  },
  methods: {
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
