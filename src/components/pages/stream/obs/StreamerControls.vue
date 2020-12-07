<template>
  <div class="bottom-btns">
    <span
      role="button"
      class="bottom-btn"
      :class="{ selected: asideType === 'comments' }"
      @click="changeType('comments')"
    >
      <span
        class="btn-icon comments icn-item icn-size_lg"
        v-tooltip="'Comments'"
      />
    </span>
    <span
      class="bottom-btn"
      :class="{ selected: asideType === 'likes' }"
      ref="likeBtn"
      @click="changeType('likes')"
    >
      <span class="btn-icon likes icn-item icn-size_lg" v-tooltip="'Likes'" />
      {{ likesCount ? likesCount : "" }}
    </span>
    <span
      class="stream-btn bottom-btn"
      :class="{ selected: asideType === 'tip', disabled: true }"
    >
      <span class="btn-icon icn-tips icn-item icn-size_lg" v-tooltip="'Tips'" />
      ${{ amount }}
    </span>
    <span
      role="button"
      class="stream-online-count bottom-btn"
      @click="changeType('viewers')"
      :class="{ selected: asideType === 'viewers' }"
    >
      <span
        class="looking btn-icon icn-item icn-size_lg"
        v-tooltip="'Viewers'"
      />
      {{ viewsCount }}
    </span>
    <span
      v-if="!isTipsGoalExists"
      class="stream-online-count bottom-btn"
      @click="toggleTipGoalForm"
      :class="{ selected: true }"
    >
      <span
        class="btn-icon icn-item icn-size_lg icn-price has-tooltip"
        v-tooltip="'Set tips goal'"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: "StreamerControls",
  props: {
    asideType: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    isTipsGoalExists: {
      type: Boolean
    },
    toggleTipGoalForm: {
      type: Function
    }
  },
  methods: {
    changeType(type) {
      this.$emit("changeType", type);
    }
  }
};
</script>
