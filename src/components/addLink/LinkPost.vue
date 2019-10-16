<template>
  <div class="link">
    <a :href="link.url" target="_blank">
      <img v-if="faviconIco" :src="faviconIco" alt="" />
      <div class="description">
        <div class="description__title">{{ link.title }}</div>
        <div class="description__url" v-html="truncate(link.url)"></div>
      </div>
    </a>
    <div v-if="isOwner(this.profile.id)" class="controls">
      <button @click="$emit('edit')">Edit</button>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import truncate from "truncate-html";

export default {
  name: "LinkPost",
  props: ["link"],
  mixins: [UserMixin],
  computed: {
    faviconIco() {
      return this.getFaviconIco();
    },
    profile() {
      return this.$store.state.profile.home.profile;
    }
  },
  methods: {
    getFaviconIco() {
      const fullPath = this.$props.link.url;
      if (fullPath.indexOf("https://stars.avn.com") !== -1)
        return "/static/img/avn/favicon.ico";
      if (fullPath.indexOf("//") === -1) return "/static/img/avn/favicon.ico";
      const fullPathArray = fullPath.split("//");
      const protocol = fullPathArray[0];
      const domen = fullPathArray[1].split("/")[0];
      const iconUrl = protocol + "//" + domen + "/favicon.ico";
      return iconUrl;
    },
    truncate(v) {
      return truncate(v, 50);
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  max-width: 500px;
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    img {
      min-width: 40px;
      min-height: 40px;
      margin-right: 15px;
      flex-basis: 40px;
      object-fit: contain;
    }
    .description {
      flex-grow: 1;
      &__title {
        color: #222b32;
        font-weight: bold;
      }
      &__url {
        color: #2196f3;
      }
    }
  }
  .controls {
    margin-left: auto;
    button {
      margin: 0 1rem;
      padding: 0.5rem 1rem;
      color: #2196f3;
      border: none;
      background-color: rgba(124, 139, 150, 0.1);
      border-radius: 3px;
      &:hover {
        background-color: rgba(124, 139, 150, 0.473);
      }
    }
  }
}
</style>
