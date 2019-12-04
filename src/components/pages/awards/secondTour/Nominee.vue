<template>
  <figure :class="{ voted: nominee.isVoted, disabled: nominee.disabled }">
    <div v-if="nominee.dummy" class="dummy"></div>
    <template v-else>
      <Loader v-if="voting" :fullscreen="false" :inline="true" :small="true" />
      <a class="button" @click="$emit('vote', nominee.nomineeId)" />
      <img
        :src="nominee.nominationAvatar"
        class="image"
        @click="$emit('vote', nominee.nomineeId)"
      />
      <div class="name-block">
        <div class="">{{ nominee.nominationName }}</div>
        <TwitterShare v-if="!twitterScriptLoading" :nominee="nominee" />
      </div>
    </template>
  </figure>
</template>

<script>
import Loader from "@/components/common/Loader";
import TwitterShare from "./TwitterShare";

export default {
  name: "nominee",
  components: {
    Loader,
    TwitterShare
  },
  props: {
    nominee: Object,
    voting: Boolean,
    twitterScriptLoading: Boolean
  }
};
</script>
