<template>
  <div
    class="bg-profile bg-profile_height bg-profile_height-lg bg-profile_sticky bg-profile_sticky-default bg-color bg-gradient_standart"
    :style="bgStyle"
    ref="bg"
  >
    <div class="container">
      <div class="profile-buttons">
        <button
          @click="clickVoteHandler"
          class="btn vote-btn"
          v-if="isUserNominatable && $mq === 'desktop'"
        >
          <span class="icn-award icn-item icn-size_lg" />
          Vote 4 Me!
        </button>
        <div
          class="controls-select-picture"
          v-if="isOwner(profile.id) && !profile.header"
        >
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
      stopHeight: 250,
      genderId: 91
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
    },
    isUserNominatable() {
      return (
        this.profile.nominee &&
        this.filterNominationLinksByGender(this.genderId).length
      );
    }
  },
  methods: {
    clickVoteHandler() {
      const filteredList = this.filterNominationLinksByGender(this.genderId);
      if (!this.profile.nominatedList || !filteredList.length) {
        return;
      }
      if (filteredList.length === 1) {
        this.$router.push(this.url(this.profile.nominatedList[0]));
      } else {
        this.$store.dispatch("modal/show", {
          name: "voting",
          data: { list: this.profile.nominatedList }
        });
      }
    },
    filterNominationLinksByGender(genderId) {
      return this.profile.nominatedList.filter(
        item => item.eventId == genderId
      );
    },
    url(v) {
      return "/vote/" + v.nomineeId + "/avn_awards/" + v.categoryId;
    }
  },
  mounted() {
    this.$store.commit("global/setScrollBarWidth", getScrollbarWidth());
  }
};
</script>
