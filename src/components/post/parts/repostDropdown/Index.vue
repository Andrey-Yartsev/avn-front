<template>
  <span
    class="actions__btn retweet_btn"
    :class="['more-functions', { open: opened }]"
    v-click-outside="hide"
  >
    <div class="more-functions__overlay" @click="hide"></div>
    <span class="btn-icon icn-item icn-size_lg">
      <img
        class="retweetMark__icon"
        width="20"
        height="20"
        src="/static/img/retweet.svg"
        @click="open"
      />
    </span>
    <div class="more-functions__dropdown">
      <Dropdown
        :post="post"
        :from="from"
        :hide="hide"
        v-on:clickOnDetailsView="$emit('clickOnDetailsView')"
      />
    </div>
  </span>
</template>

<script>
import Dropdown from "./Dropdown";
import ClickOutside from "vue-click-outside";
import userMixin from "@/mixins/user";

export default {
  name: "Actions",
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
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.$emit("footerDropdownToggle");
    },
    hide() {
      this.opened = false;
      this.$emit("footerDropdownToggle");
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
