<template>
  <div
    class="bg-profile bg-profile_height bg-profile_height-lg bg-profile_sticky bg-profile_sticky-default bg-color bg-gradient_standart"
    :style="bgStyle"
  >
    <div class="container" v-if="isOwner(profile.id) && !profile.header">
      <div class="controls-select-picture">
        <label
          for="bg"
          class="select-user-image select-user-image_cover select-user-image_cover-lg"
          :class="{ hide: profile.header || !showBgAdd }"
          ><span class="select-user-image__text">Add background picture</span
          ><span class="icn-item icn-media"></span
        ></label>
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
          />
          <button class="btn save-changes" @click="saveBg">Save changes</button>
        </div>
      </div>
    </div>
    <Loader :fullscreen="false" text="" class="small" v-if="gettingBgPreview" />
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import ProfileBg from "@/mixins/profileBg";
import Loader from "@/components/common/Loader";

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
  components: {
    Loader
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
