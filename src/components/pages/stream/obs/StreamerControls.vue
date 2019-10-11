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
      :class="{ selected: asideType === 'like', disabled: !likesCount }"
      ref="likeBtn"
      @click="asideType = 'like'"
    >
      <span class="btn-icon likes icn-item icn-size_lg" v-tooltip="'Likes'" />
      {{ likesCount ? likesCount : "" }}
    </span>
    <span
      v-if="$root.showTips"
      class="stream-btn bottom-btn"
      @click="asideType = 'tip'"
      :class="{ selected: asideType === 'tip', disabled: !amount }"
    >
      <span class="btn-icon icn-tips icn-item icn-size_lg" v-tooltip="'Tips'" />
      {{ amount }}
    </span>
    <span
      class="stream-online-count bottom-btn"
      @click="asideType = 'view'"
      :class="{ selected: asideType === 'view', disabled: !looksCount }"
    >
      <span
        class="looking btn-icon icn-item icn-size_lg"
        v-tooltip="'Viewers'"
      />
      {{ looksCount }}
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
      likesCount: Number,
      default: 0
    }
  },
  computed: {
    looksCount() {
      return "X";
    }
  },
  methods: {
    changeType(type) {
      this.$emit("changeType", type);
    }
  }
};
</script>
