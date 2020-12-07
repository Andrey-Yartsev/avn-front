<template>
  <div class="link-row">
    <a :href="link.url" target="_blank" class="link-row__info">
      <span v-if="link.pinned" class="icn-pin icn-item icn-size_md" />
      <span class="link-row__logo">
        <span
          v-if="iconImage"
          class="icn-web icn-item icn-size_lg"
          style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"
        />
        <img v-if="iconUrl" :src="iconUrl" alt="" />
      </span>
      <div class="link-row__content">
        <div class="link-row__title">{{ link.title }}</div>
        <div class="link-row__url" v-html="truncate(link.url)"></div>
      </div>
    </a>
    <div v-if="isOwner(this.profile.id)" class="link-row__controls">
      <button @click="$emit('edit')" class="btn">
        Edit
      </button>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import truncate from "truncate-html";

export default {
  name: "LinkItem",
  props: ["link"],
  mixins: [UserMixin],
  data() {
    return {
      iconUrl: "",
      iconImage: false
    };
  },
  computed: {
    profile() {
      return this.$store.state.profile.home.profile;
    }
  },
  methods: {
    async getFaviconIco() {
      const fullPath = this.$props.link.url;
      if (fullPath.indexOf("https://stars.avn.com") !== -1) {
        this.iconUrl = "/static/img/avn/favicon.ico";
        return;
      }
      if (fullPath.indexOf("//") === -1) {
        this.iconUrl = "/static/img/avn/favicon.ico";
        return;
      }
      const fullPathArray = fullPath.split("//");
      const protocol = fullPathArray[0];
      const domen = fullPathArray[1].split("/")[0];
      const iconUrl = protocol + "//" + domen + "/favicon.ico";
      const icon = await this.isFaviconExists(iconUrl);
      if (icon) {
        this.iconUrl = icon;
      } else {
        this.iconImage = true;
      }
    },
    isFaviconExists(url) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
          resolve(url);
        };
        img.onerror = function() {
          resolve(null);
        };
        img.src = url;
      });
    },
    truncate(v) {
      return truncate(v, 50);
    }
  },
  mounted() {
    this.getFaviconIco();
  }
};
</script>
