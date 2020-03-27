<template>
  <span
    class="actions__btn retweet_btn"
    :class="[
      'more-functions',
      { open: opened },
      { 'more-functions_dir-inverse': postView === 'large' }
    ]"
    v-click-outside="hideFooter"
  >
    <div class="more-functions__overlay" @click="hideFooter"></div>
    <span class="btn-icon icn-item icn-size_md" v-tooltip="'Repost'">
      <img
        class="retweetMark__icon"
        width="20"
        height="20"
        src="/static/img/retweet.svg"
        @click="openFooter"
      />
    </span>
    <div class="more-functions__dropdown">
      <Dropdown :post="post" :from="from" :hide="hideFooter" />
    </div>
  </span>
</template>

<script>
import Dropdown from "./Dropdown";
import ClickOutside from "vue-click-outside";
import userMixin from "@/mixins/user";

export default {
  name: "RepostDropdown",
  mixins: [userMixin],
  components: {
    Dropdown
  },
  data: () => ({
    opened: false
  }),
  props: {
    post: {
      type: Object,
      isRequired: true
    },
    //Needs for MediumView and LargeView different behaviours
    from: {
      type: String,
      required: true
    },
    postView: String
  },
  methods: {
    openFooter() {
      if (!this.opened) {
        this.opened = true;
        this.$emit("openFooter");
      }
    },
    hideFooter() {
      if (this.opened) {
        this.opened = false;
        this.$emit("hideFooter");
      }
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
