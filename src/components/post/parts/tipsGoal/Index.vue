<template>
  <div class="postTipsGoal">
    <div class="title">Post Tips Goal</div>
    <div class="postTipsGoal__progress">
      <div class="progress-start">$0</div>
      <div class="progress-line">
        <div
          class="progress-line__bar"
          :style="{ width: `${achievedPercentage}%` }"
        />
        <span
          class="progress-line__status"
          :style="{ left: `${achievedPercentage}%` }"
          >{{ achievedPercentage }}%</span
        >
      </div>
      <div class="progress-end">${{ data.total }}</div>
    </div>
  </div>
</template>

<script>
import mockData from "@/mock/postTipsGoal";

export default {
  name: "PostTipsGoal",
  props: {
    // data: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      data: mockData
    };
  },
  computed: {
    achievedPercentage() {
      return (this.data.achieved / (this.data.total / 100)).toFixed(0);
    }
  }
};
</script>
