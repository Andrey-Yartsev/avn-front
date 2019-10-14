<template>
  <div class="link">
    <a :href="link.url" target="_blank">
      <img v-if="faviconIco" :src="faviconIco" alt="" />
      <div class="title">{{ link.title }}</div>
    </a>
    <div v-if="isOwner(this.profile.id)" class="controls">
      <button @click="$emit('edit')">Edit</button>
      <button @click="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";

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
      if (fullPath.indexOf("//") === -1) return null;
      const fullPathArray = fullPath.split("//");
      const protocol = fullPathArray[0];
      const domen = fullPathArray[1].split("/")[0];
      const iconUrl = protocol + "//" + domen + "/favicon.ico";
      return iconUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  max-width: 400px;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    img {
      width: 30px;
      height: 30px;
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
