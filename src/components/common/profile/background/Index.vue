<template>
  <div class="bg-profile bg-color bg-gradient_standart" :style="bgStyle">
    <div class="container" v-if="isOwner(profile.id) && !profile.header">
      <div class="controls-select-picture">
        <label
          for="bg"
          class="select-user-image"
          :class="{ hide: profile.header || !showBgAdd }"
          >Add background picture</label
        >
        <input
          type="file"
          id="bg"
          ref="bg"
          accept=".jpg,.jpeg,.gif,.png"
          @change="setBgPreview"
        />
        <div class="profile-picture-btns" :class="{ show: showBgSave }">
          <button
            class="btn-cancel-changes cancel-changes"
            @click="resetBgPreview"
          ></button>
          <button class="btn save-changes" @click="saveBg">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import ProfileBg from "@/mixins/profileBg";

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

export default {
  name: "ProfileBackground",
  mixins: [UserMixin, ProfileBg],
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  computed: {
    bgStyle() {
      const style = {
        "margin-right": `${-this.scrollBarWidth}px`,
        "padding-right": `${this.scrollBarWidth}px`
      };
      return this.bgPreview || this.profile.header
        ? {
            ...style,
            "background-image": `url(${this.bgPreview || this.profile.header})`
          }
        : style;
    },
    scrollBarWidth() {
      return this.$store.state.global.scrollBarWidth;
    }
  },
  mounted() {
    this.$store.commit("global/setScrollBarWidth", getScrollbarWidth());
  }
};
</script>
