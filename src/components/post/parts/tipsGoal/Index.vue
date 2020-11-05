<template>
  <div class="postTipsGoal">
    <div class="postTipsGoal__content">
      <div class="title">{{ data.text }}</div>
      <div class="postTipsGoal__progress">
        <div class="progress-icon">
          <span class="icn-item icn-size_lg icn-tips" />
        </div>
        <div class="progress-sum">${{ data.achieved }}</div>
        <div class="progress-total semi-transparent">${{ data.total }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostTipsGoal",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    achievedPercentage() {
      return (this.data.achieved / (this.data.total / 100)).toFixed(0);
    }
  }
};
</script>
