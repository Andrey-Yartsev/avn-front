<template>
  <div v-if="previews.length" class="linksPreview">
    <div v-for="preview in previews" :key="preview.thumb" class="preview">
      <div class="image">
        <img :src="preview.thumb" alt="link image" />
      </div>
      <div v-if="preview.title" class="details">
        <h6 class="title">{{ preview.title }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinksPreview",
  props: {
    text: String
  },
  data() {
    return {
      links: [],
      previews: []
    };
  },
  computed: {
    domain() {
      const location = window.location.origin;
      switch (location) {
        case "https://stars.avn.com":
          return "prod";
        default:
          return "dev";
      }
    }
  },
  methods: {
    getMediaLinksFromText(text) {
      if (text?.length) {
        const regexp =
          this.domain === "prod"
            ? /https:\/\/stars.avn.com\/media\S+\b/g
            : /https:\/\/avn2.retloko.com\/media\S+\b/g;

        const result = text.match(regexp);
        return result;
      }
      return null;
    },
    validMediaLinks(list) {
      const idList = list.map(item => item.split("/").pop());
      return idList.filter(item => /^\d+$/.test(item));
    },
    getPreviews() {
      this.previews = [];
      this.links.forEach(productId => {
        this.$store
          .dispatch("profile/media/getMediaForPreview", productId)
          .then(res => {
            const { title, thumb } = res;
            this.previews.push({ title, thumb });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  },
  watch: {
    text(value) {
      const matchedLinks = this.getMediaLinksFromText(value);
      if (matchedLinks?.length) {
        const validLinks = this.validMediaLinks(matchedLinks);
        if (validLinks.length) {
          this.links = validLinks;
        }
      } else if (
        (!matchedLinks || !matchedLinks.length) &&
        this.previews.length
      ) {
        this.previews = [];
      }
    },
    "links.length"(len) {
      if (!len) {
        this.previews = [];
        return;
      }
      this.getPreviews();
    }
  }
};
</script>

<style lang="scss" scoped>
.linksPreview {
  padding: 5px;
}
.preview {
  margin: auto;
  width: 200px;
  height: auto;
  background-color: #e0d4d44d;
  border-radius: 5px;
  overflow: hidden;
  .image {
    img {
      display: block;
      width: 200px;
      height: 160px;
      object-fit: cover;
    }
  }
  .details {
    padding: 5px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .title {
      color: black;
      font-size: 12px;
    }
    .description {
      color: black;
    }
  }
}
</style>
