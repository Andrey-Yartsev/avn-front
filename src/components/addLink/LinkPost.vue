<template>
  <div class="link-row">
    <a :href="link.url" target="_blank" class="link-row__info">
      <img v-if="faviconIco" :src="faviconIco" alt="" />
      <div class="description">
        <div class="description__title">{{ link.title }}</div>
        <div class="description__url" v-html="truncate(link.url)"></div>
      </div>
    </a>
    <div v-if="isOwner(this.profile.id)" class="link-row__controls">
      <button @click="$emit('edit')" class="btn btn_fix-width-ex-sm">Edit</button>
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
