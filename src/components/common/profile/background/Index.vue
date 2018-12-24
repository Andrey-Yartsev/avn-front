<template>
  <div class="bg-profile">
    <div class="bg-wrap">
      <img v-if="bgPreview" :src="bgPreview" />
      <img v-else-if="profile.header" :src="profile.header" />
    </div>
    <div class="container" v-if="isOwner(profile.id)">
      <div class="controls-select-picture">
        <label
          for="bg" class="select-user-image"
          :class="{hide: !showBgAdd}"
        >Add background picture</label>
        <input
          type="file"
          id="bg"
          ref="bg"
          accept=".jpg,.jpeg,.gif,.png"
          @change="setBgPreview"
        >
        <div class="profile-picture-btns" :class="{show: showBgSave}">
          <button
            class="btn-cancel-changes cancel-changes"
            @click="resetBgPreview"
          ></button>
          <button
            class="btn save-changes"
            @click="saveBg"
          >Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMixin from "@/mixins/user";
import ProfileBg from "@/mixins/profileBg";

export default {
  name: "ProfileBackground",
  mixins: [UserMixin, ProfileBg],
  props: {
    profile: {
      type: Object,
      required: true
    }
  }
};
</script>
