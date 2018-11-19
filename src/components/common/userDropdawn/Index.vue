<template>
  <div
    class="more-functions"
    :class="{open: opened}"
    v-click-outside="hide"
  >
    <div
      class="more-functions__btn more-functions__btn_with-text"
      @click="open"
    >
      <div class="more-functions__btn-text">
        More
      </div>
    </div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul>
          <li><a href="#" @click.prevent="report">Report</a></li>
          <li v-if="profile.isBlocked"><a href="#" @click.prevent="unblock">Unblock</a></li>
          <li v-else><a href="#" @click.prevent="block">Block</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "SearchUserDropdown",

  directives: {
    ClickOutside
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      opened: false
    };
  },

  methods: {
    report() {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: this.profile.id
      });
    },
    block() {
      this.$store.dispatch("search/page/block", this.profile.id);
    },
    unblock() {
      this.$store.dispatch("search/page/unblock", this.profile.id);
    },
    open() {
      this.opened = true;
      this.$emit("openDropdawn");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdawn");
    }
  }
};
</script>
