<template>
  <div class="popup popup-stream-details">
    <div class="overlay" />
    <div class="stream-summary-container">
      <div class="stream-chart-legend">
        <div class="stream-chart-legend-item stream-chart-legend-item__viewers">
          <span class="stream-chart-legend-item-label">Viewers</span>
          <span class="stream-chart-legend-item-value">{{
            this.looks.length
          }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__likes">
          <span class="stream-chart-legend-item-label">Likes</span>
          <span class="stream-chart-legend-item-value">{{
            this.likes.length
          }}</span>
        </div>
        <div
          v-if="$root.showTips"
          class="stream-chart-legend-item stream-chart-legend-item__tips"
        >
          <span class="stream-chart-legend-item-label">Tips</span>
          <span class="stream-chart-legend-item-value">{{ this.tips }}</span>
        </div>
        <div
          class="stream-chart-legend-item stream-chart-legend-item__comments"
        >
          <span class="stream-chart-legend-item-label">Comments</span>
          <span class="stream-chart-legend-item-value">{{
            this.comments.length
          }}</span>
        </div>
      </div>
      <div class="stream-details">
        <div class="stream-chart-wrapper">
          <div id="stream-chart" />
          <div class="stream-chart-scale">
            <span
              class="stream-chart-scale__item"
              v-for="item in chartScaleUnits"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="stream-summary-data-wrapper">
          <div
            class="stream-summary-data-item stream-summary-data-item__duration"
          >
            <div class="stream-summary-data-item__label">Duration</div>
            <div class="stream-summary-data-item__value">
              {{ this.duration }}
            </div>
          </div>
          <div
            class="stream-summary-data-item stream-summary-data-item__viewers"
          >
            <div class="stream-summary-data-item__label">
              <span class="btn-icon icn-viewer icn-item"></span>Viewers
            </div>
            <div class="stream-summary-data-item__value">
              {{ this.looks.length }}
            </div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__likes">
            <div class="stream-summary-data-item__label">
              <span class="btn-icon likes icn-item icn-size_lg"></span>Likes
            </div>
            <div class="stream-summary-data-item__value">
              {{ this.likes.length }}
            </div>
          </div>
          <div
            v-if="$root.showTips"
            class="stream-summary-data-item stream-summary-data-item__tips"
          >
            <div class="stream-summary-data-item__label">
              <span class="btn-icon icn-tips icn-item"></span>Tips
            </div>
            <div class="stream-summary-data-item__value">{{ this.tips }}</div>
          </div>
          <div
            class="stream-summary-data-item stream-summary-data-item__comments"
          >
            <div class="stream-summary-data-item__label">
              <span class="btn-icon comments icn-item"></span>Comments
            </div>
            <div class="stream-summary-data-item__value">
              {{ this.comments.length }}
            </div>
          </div>
        </div>
      </div>
      <div class="stream-toggle-controls">
        <label class="share-stream-label toggle-wrapper" v-if="canBeSaved">
          Share this stream to your profile feed.
          <div class="toggle-element">
            <input type="checkbox" class="share-stream" v-model="haveToSave" />
            <span class="toggle-element_switcher"></span>
          </div>
        </label>
        <label
          class="share-stream-label toggle-wrapper"
          v-if="canBeSaved && haveToSave"
        >
          Keep comments.
          <div class="toggle-element">
            <input
              type="checkbox"
              class="share-stream"
              v-model="haveToSaveComments"
            />
            <span class="toggle-element_switcher"></span>
          </div>
        </label>
      </div>
      <div
        class="mediasBottom"
        @click="() => this.close(this.haveToSave, this.haveToSaveComments)"
      >
        <button
          class="btn alt lg block change-devices btn-center btn_fix-width btn_not-bold btn_white btn_white-alfabg"
          :disabled="saving"
        >
          {{ saving ? "Saving" : "Done" }}
        </button>
      </div>
    </div>
    <Loader text="" :semidark="true" v-if="loading" />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import { format, fromUnixTime } from "date-fns";
import ChartSettings from "./ChartSettings.js";

export default {
  name: "Statistic",
  components: {
    Loader
  },
  data() {
    return {
      haveToSave: false,
      haveToSaveComments: false
    };
  },
  props: {
    close: {
      type: Function,
      isRequired: true
    },
    duration: {
      type: String,
      isRequired: true
    },
    streamDuration: {
      type: Number,
      isRequired: true
    },
    streamStartTime: {
      type: Number,
      isRequired: true
    },
    canBeSaved: {
      type: Boolean,
      isRequired: true
    },
    loading: {
      type: Boolean,
      isRequired: true
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    comments() {
      return this.$store.state.lives.currentLive.statistic
        .stream_comment_search_all.data;
    },
    tips() {
      return this.$store.state.lives.currentLive.statistic.stream_tip_search_all.data
        .reduce((m, i) => {
          return m + +i.message.data_tips_amount;
        }, 0)
        .toFixed(2);
    },
    likes() {
      return this.$store.state.lives.currentLive.statistic
        .stream_like_search_all.data;
    },
    looks() {
      return this.$store.state.lives.currentLive.statistic
        .stream_look_search_all.data;
    },
    chartScaleUnits() {
      const arr = [];
      for (let i = 0; i <= this.scale; i++) {
        let item = format(
          fromUnixTime(Math.round(i * this.streamScaleUnit)),
          this.format
        );

        arr.push(item);
      }

      return arr;
    }
  },
  methods: {
    buildChart() {
      this.format = this.streamDuration < 3600 ? "m:ss" : "HH:mm:ss";
      this.barCount = this.streamDuration < 47 ? this.streamDuration : 47;
      this.scale = this.streamDuration < 4 ? this.streamDuration : 4;
      this.streamScaleUnit = this.streamDuration / this.scale;
      this.streamUnitTime = this.streamDuration / this.barCount;
      this.CHART = global.AmCharts.makeChart("stream-chart", ChartSettings);

      for (let i = 0; i < this.barCount; i += 1) {
        this.CHART.dataProvider.push({
          date: Math.round(this.streamStartTime + i * this.streamUnitTime),
          look: 0,
          like: 0,
          tip: 0,
          comment: 0
        });
      }

      setTimeout(() => {
        this.CHART.validateData();
      }, 1000);
    },
    prepareData(code) {
      const statCode = `stream_${code}_search_all`;
      const { data } = this.$store.state.lives.currentLive.statistic[statCode];
      const approx = {};

      data.forEach(item => {
        const timestamp = format(new Date(item.message.timestamp), "t");
        let diff = 0;
        let currIndex = 0;

        for (let index = 0; index < this.barCount; index += 1) {
          let momentDiff = Math.abs(
            this.CHART.dataProvider[index].date - timestamp
          );

          if (index === 0 || diff > momentDiff) {
            diff = momentDiff;
            currIndex = index;
          }
        }

        approx[currIndex] = (approx[currIndex] || 0) + 1;
      });

      for (let i in approx) {
        this.CHART.dataProvider[i][code] = approx[i];
      }

      this.CHART.validateData();
    }
  },
  mounted() {
    this.buildChart();
  },
  watch: {
    comments() {
      this.prepareData("comment");
    },
    tips() {
      this.prepareData("tip");
    },
    likes() {
      this.prepareData("like");
    },
    looks() {
      this.prepareData("look");
    }
  }
};
</script>
