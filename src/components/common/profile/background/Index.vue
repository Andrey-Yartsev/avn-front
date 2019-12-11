<template>
  <div
    class="bg-profile bg-profile_height bg-profile_height-lg bg-profile_sticky bg-profile_sticky-default bg-color bg-gradient_standart"
    :style="bgStyle"
    ref="bg"
  >
    <button @click="clickVoteHandler" class="btn alt" v-if="$mq === 'desktop'">
      Vote for me
    </button>
    <div class="container" v-if="isOwner(profile.id)">
      <div class="profile-buttons">
        <div class="controls-select-picture" v-if="!profile.header">
          <label
            for="bg"
            class="select-user-image select-user-image_cover select-user-image_cover-lg"
            :class="{ hide: profile.header || hideBgAdd }"
            ><span class="select-user-image__text">Add background picture</span>
            <span
              class="icn-item icn-media"
              :class="{
                'icn-size_lg': $mq === 'mobile',
                'icn-size_extralg': $mq === 'desktop'
              }"
            />
          </label>
          <input
            type="file"
            id="bg"
            ref="bgMain"
            accept=".jpg,.jpeg,.gif,.png"
            @change="setBgPreview"
          />
          <div class="profile-picture-btns" :class="{ show: showBgSave }">
            <button
              class="btn-cancel-changes cancel-changes icn-item icn-size_lg"
              @click="resetBgPreview"
            />
            <button
              class="btn save-changes"
              @click="saveBg({ isClear: false, refName: 'bgMain' })"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <span
      class="loader-container loader-container_center"
      v-if="gettingBgPreview"
    >
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </span>
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
  data() {
    return {
      headerHeight: 320 + 85, // bg + menu
      stopHeight: 250
    };
  },
  computed: {
    bgStyle() {
      const style = {
        "margin-right": `${-this.scrollBarWidth}px`,
        "padding-right": `${this.scrollBarWidth}px`
      };
      return this.bgPreview || this.profile.headerFull
        ? {
            ...style,
            "background-image": `url(${this.bgPreview ||
              this.profile.headerFull})`
          }
        : style;
    },
    scrollBarWidth() {
      return this.$store.state.global.scrollBarWidth;
    }
  },
  methods: {
    clickVoteHandler() {
      this.$store.dispatch("modal/show", { name: "voting" });
    }
  },
  mounted() {
    this.$store.commit("global/setScrollBarWidth", getScrollbarWidth());
  }
};
</script>
