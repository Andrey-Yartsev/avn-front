<template>
  <div class="popup popup-stream-details">
    <div class="overlay" />
    <div class="stream-summary-container">
      <div class="stream-chart-legend">
        <div class="stream-chart-legend-item stream-chart-legend-item__viewers">
          <span class="stream-chart-legend-item-label">Viewers</span>
          <span class="stream-chart-legend-item-value">{{ looks }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__likes">
          <span class="stream-chart-legend-item-label">Likes</span>
          <span class="stream-chart-legend-item-value">{{ likes }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__tips">
          <span class="stream-chart-legend-item-label">Tips</span>
          <span class="stream-chart-legend-item-value">{{ tips }}</span>
        </div>
        <div
          class="stream-chart-legend-item stream-chart-legend-item__comments"
        >
          <span class="stream-chart-legend-item-label">Comments</span>
          <span class="stream-chart-legend-item-value">{{ comments }}</span>
        </div>
      </div>
      <div class="stream-details">
        <div class="stream-chart-wrapper">
          <div id="stream-chart" />
          <div class="stream-chart-scale"></div>
        </div>
        <div class="stream-summary-data-wrapper">
          <div
            class="stream-summary-data-item stream-summary-data-item__duration"
          >
            <div class="stream-summary-data-item__label">Duration</div>
            <div class="stream-summary-data-item__value">
              {{ duration }}
            </div>
          </div>
          <div
            class="stream-summary-data-item stream-summary-data-item__viewers"
          >
            <div class="stream-summary-data-item__label">
              <span class="btn-icon icn-viewer icn-item"></span>Viewers
            </div>
            <div class="stream-summary-data-item__value">
              {{ looks }}
            </div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__likes">
            <div class="stream-summary-data-item__label">
              <span class="btn-icon likes icn-item icn-size_lg"></span>Likes
            </div>
            <div class="stream-summary-data-item__value">
              {{ likes }}
            </div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__tips">
            <div class="stream-summary-data-item__label">
              <span class="btn-icon icn-tips icn-item"></span>Tips
            </div>
            <div class="stream-summary-data-item__value">{{ tips }}</div>
          </div>
          <div
            class="stream-summary-data-item stream-summary-data-item__comments"
          >
            <div class="stream-summary-data-item__label">
              <span class="btn-icon comments icn-item"></span>Comments
            </div>
            <div class="stream-summary-data-item__value">
              {{ comments }}
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

export default {
  name: "StatisticObs",
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
    },
    isObsStream: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    comments() {
      return this.$store.state.obs.selfStreamFinishedData.commentsCount;
    },
    tips() {
      return this.$store.state.obs.selfStreamFinishedData.tipsCount;
    },
    likes() {
      return this.$store.state.obs.selfStreamFinishedData.likesCount;
    },
    looks() {
      return this.$store.state.obs.selfStreamFinishedData.viewsCount;
    }
  }
};
</script>
