<template>
  <div class="bottom-btns">
    <!--
    <span
      role="button"
      class="bottom-btn"
      :class="{ selected: asideType === 'comments', disabled: true }"
      @click="changeType('comments')"
    >
      <span
        class="btn-icon comments icn-item icn-size_lg"
        v-tooltip="'Comments'"
      />
    </span>
    -->
    <span
      class="bottom-btn"
      :class="{ selected: asideType === 'like', disabled: true }"
      ref="likeBtn"
    >
      <span class="btn-icon likes icn-item icn-size_lg" v-tooltip="'Likes'" />
      {{ likesCount ? likesCount : "" }}
    </span>
    <span
      v-if="$root.showTips"
      class="stream-btn bottom-btn"
      :class="{ selected: asideType === 'tip', disabled: true }"
    >
      <span class="btn-icon icn-tips icn-item icn-size_lg" v-tooltip="'Tips'" />
      ${{ amount }}
    </span>
    <span
      class="stream-online-count bottom-btn"
      :class="{ selected: asideType === 'view', disabled: true }"
    >
      <span
        class="looking btn-icon icn-item icn-size_lg"
        v-tooltip="'Viewers'"
      />
      {{ viewsCount }}
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
    }
  },
  methods: {
    changeType(type) {
      this.$emit("changeType", type);
    }
  }
};
</script>
