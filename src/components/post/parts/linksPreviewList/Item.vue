<template>
  <div class="linkPreview-wrapper" :class="{ small: $mq === 'mobile' }">
    <template v-if="isLinkExists">
      <router-link :to="linkUrl">
        <div class="image">
          <img :src="link.thumb" alt="link image" />
        </div>
        <div v-if="link.title" class="details">
          <h5 class="title">{{ link.title }}</h5>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: "LinkPreviewItem",
  props: {
    linkUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fetching: true,
      link: null,
      maxTextLength: 50
    };
  },
  computed: {
    isLinkExists() {
      return !this.fetching && !!this.link && !!this.link.thumb;
    },
    productId() {
      return this.linkUrl.split("/").pop();
    },
    trimmedText() {
      if (!this.link.text) {
        return "";
      }
      return this.link.text.length > this.maxTextLength
        ? this.link.text.slice(0, this.maxTextLength - 3) + "..."
        : this.link.text;
    },
    hasDetails() {
      return this.link.title || this.link.text;
    }
  },
  methods: {
    fetchMedia() {
      this.fetching = true;
      this.$store
        .dispatch("profile/media/getMediaForPreview", this.productId)
        .then(res => {
          const { title, text } = res;
          const thumb = res.media.thumb && res.media.thumb.source;
          this.link = { title, text, thumb };
          this.fetching = false;
        })
        .catch(err => {
          console.log(err);
          this.fetching = false;
        });
    }
  },
  mounted() {
    this.fetchMedia();
  }
};
</script>

<style lang="scss" scoped>
.linkPreview-wrapper {
  width: 400px;
  height: auto;
  margin: 15px auto;
  background-color: #e0d4d44d;
  border-radius: 5px;
  overflow: hidden;
  &.small {
    width: 350px;
    .image {
      img {
        display: block;
        width: 350px;
        height: 250px;
      }
    }
  }
  .image {
    img {
      display: block;
      width: 400px;
      height: 350px;
      object-fit: cover;
    }
  }
  .details {
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title {
      color: black;
      font-size: 16px;
    }
    .description {
      color: black;
    }
  }
}
</style>
