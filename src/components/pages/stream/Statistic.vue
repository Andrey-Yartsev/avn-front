<template>
  <div class="popup popup-stream-details">
    <div class="overlay"></div>
    <div class="stream-summary-container">
      <div class="stream-chart-legend">
        <div class="stream-chart-legend-item stream-chart-legend-item__viewers">
          <span class="stream-chart-legend-item-label">Viewers</span>
          <span class="stream-chart-legend-item-value">{{ this.looks.length }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__likes">
          <span class="stream-chart-legend-item-label">Likes</span>
          <span class="stream-chart-legend-item-value">{{ this.likes.length }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__tips">
          <span class="stream-chart-legend-item-label">Funds</span>
          <span class="stream-chart-legend-item-value">{{ this.tips.length }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__comments">
          <span class="stream-chart-legend-item-label">Comments</span>
          <span class="stream-chart-legend-item-value">{{ this.comments.length }}</span>
        </div>
      </div>
      <div class="stream-details">
          <div class="stream-chart-wrapper">
              <div id="stream-chart">
                  <div class="amcharts-main-div">
                      <div class="amcharts-chart-div">
                          <svg version="1.1">
                              <g>
                                  <path cs="100,100" d="M0.5,0.5 L479.5,0.5 L479.5,163.5 L0.5,163.5 Z" fill="#FFFFFF" stroke="#000000" fill-opacity="0" stroke-width="1" stroke-opacity="0"></path>
                                  <path cs="100,100" d="M0.5,0.5 L479.5,0.5 L479.5,163.5 L0.5,163.5 L0.5,0.5 Z" fill="#FFFFFF" stroke="#000000" fill-opacity="0" stroke-width="1" stroke-opacity="0" transform="translate(0,0)"></path>
                              </g>
                              <g>
                                  <g transform="translate(0,0)"></g>
                                  <g transform="translate(0,0)" visibility="visible">
                                      <g>
                                          <path cs="100,100" d="M0.5,163.5 L0.5,163.5 L479.5,163.5" fill="none" stroke-width="1" stroke-dasharray="6" stroke-opacity="0.1" stroke="#7c8b96"></path>
                                      </g>
                                      <g>
                                          <path cs="100,100" d="M0.5,82.5 L0.5,82.5 L479.5,82.5" fill="none" stroke-width="1" stroke-dasharray="6" stroke-opacity="0.1" stroke="#7c8b96"></path>
                                      </g>
                                      <g>
                                          <path cs="100,100" d="M0.5,0.5 L0.5,0.5 L479.5,0.5" fill="none" stroke-width="1" stroke-dasharray="6" stroke-opacity="0.1" stroke="#7c8b96"></path>
                                      </g>
                                  </g>
                              </g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g></g>
                              <g>
                                  <g transform="translate(0,0)">
                                      <g></g>
                                      <g clip-path="url(#AmChartsEl-87)">
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163 " fill="url(#AmChartsEl-85)" fill-opacity="0" stroke-width="1.5" stroke-opacity="1" stroke="#FF335A"></path>
                                          <linearGradient id="AmChartsEl-85" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#FF335A"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163  L479,163 L0,163 L0,163" fill="url(#AmChartsEl-86)" fill-opacity="0.1" stroke-width="0" stroke-opacity="0"></path>
                                          <linearGradient id="AmChartsEl-86" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#FF335A"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                      </g>
                                      <clipPath id="AmChartsEl-87">
                                          <rect x="0" y="0" width="479" height="163" rx="0" ry="0" stroke-width="0"></rect>
                                      </clipPath>
                                      <g></g>
                                  </g>
                                  <g transform="translate(0,0)">
                                      <g></g>
                                      <g clip-path="url(#AmChartsEl-90)">
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163 " fill="url(#AmChartsEl-88)" fill-opacity="0" stroke-width="1.5" stroke-opacity="1" stroke="#ff9500"></path>
                                          <linearGradient id="AmChartsEl-88" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#ff9500"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163  L479,163 L0,163 L0,163" fill="url(#AmChartsEl-89)" fill-opacity="0.1" stroke-width="0" stroke-opacity="0"></path>
                                          <linearGradient id="AmChartsEl-89" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#ff9500"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                      </g>
                                      <clipPath id="AmChartsEl-90">
                                          <rect x="0" y="0" width="479" height="163" rx="0" ry="0" stroke-width="0"></rect>
                                      </clipPath>
                                      <g></g>
                                  </g>
                                  <g transform="translate(0,0)">
                                      <g></g>
                                      <g clip-path="url(#AmChartsEl-93)">
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163 " fill="url(#AmChartsEl-91)" fill-opacity="0" stroke-width="1.5" stroke-opacity="1" stroke="#67cc2e"></path>
                                          <linearGradient id="AmChartsEl-91" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#67cc2e"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163  L479,163 L0,163 L0,163" fill="url(#AmChartsEl-92)" fill-opacity="0.1" stroke-width="0" stroke-opacity="0"></path>
                                          <linearGradient id="AmChartsEl-92" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#67cc2e"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                      </g>
                                      <clipPath id="AmChartsEl-93">
                                          <rect x="0" y="0" width="479" height="163" rx="0" ry="0" stroke-width="0"></rect>
                                      </clipPath>
                                      <g></g>
                                  </g>
                                  <g transform="translate(0,0)">
                                      <g></g>
                                      <g clip-path="url(#AmChartsEl-96)">
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163 " fill="url(#AmChartsEl-94)" fill-opacity="0" stroke-width="1.5" stroke-opacity="1" stroke="#3abfd3"></path>
                                          <linearGradient id="AmChartsEl-94" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#3abfd3"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                          <path cs="100,100" d="M0,163 C8,163,15,163,30,163 C45,163,45,163,60,163 C75,163,75,163,90,163 C105,163,105,163,120,163 C135,163,135,163,150,163 C165,163,165,163,180,163 C195,163,195,163,210,163 C225,163,225,163,240,163 C255,163,254,163,269,163 C284,163,284,163,299,163 C314,163,314,163,329,163 C344,163,344,163,359,163 C374,163,374,163,389,163 C404,163,404,163,419,163 C434,163,434,163,449,163 C464,163,472,163,479,163  L479,163 L0,163 L0,163" fill="url(#AmChartsEl-95)" fill-opacity="0.1" stroke-width="0" stroke-opacity="0"></path>
                                          <linearGradient id="AmChartsEl-95" x1="0%" x2="0%" y1="0%" y2="100%">
                                              <stop offset="0%" stop-color="#3abfd3"></stop>
                                              <stop offset="100%" stop-color="rgba(0,0,0,0)"></stop>
                                          </linearGradient>
                                      </g>
                                      <clipPath id="AmChartsEl-96">
                                          <rect x="0" y="0" width="479" height="163" rx="0" ry="0" stroke-width="0"></rect>
                                      </clipPath>
                                      <g></g>
                                  </g>
                              </g>
                              <g></g>
                              <g>
                                  <path cs="100,100" d="M0.5,163.5 L479.5,163.5 L479.5,163.5" fill="none" stroke-width="1" stroke-dasharray="6" stroke-opacity="0" stroke="#7c8b96" transform="translate(0,0)"></path>
                                  <g>
                                      <path cs="100,100" d="M0.5,0.5 L479.5,0.5" fill="none" stroke-width="1" stroke-opacity="0.2" stroke="#fff" transform="translate(0,163)"></path>
                                  </g>
                                  <g>
                                      <path cs="100,100" d="M0.5,0.5 L0.5,163.5" fill="none" stroke-width="0" stroke-opacity="1" stroke="#000000" transform="translate(0,0)" visibility="visible"></path>
                                  </g>
                              </g>
                              <g></g>
                              <g></g>
                              <g>
                                  <g transform="translate(0,0)"></g>
                                  <g transform="translate(0,0)"></g>
                                  <g transform="translate(0,0)"></g>
                                  <g transform="translate(0,0)"></g>
                              </g>
                              <g>
                                  <g></g>
                              </g>
                              <g>
                                  <g transform="translate(0,0)" visibility="visible"></g>
                                  <g transform="translate(0,0)" visibility="visible"></g>
                              </g>
                              <g></g>
                              <g transform="translate(0,0)"></g>
                              <g></g>
                              <g></g>
                          </svg>
                      </div>
                  </div>
              </div>
              <div class="stream-chart-scale">
                <span class="stream-chart-scale__item">0:00</span>
                <span class="stream-chart-scale__item">0:04</span>
                <span class="stream-chart-scale__item">0:09</span>
                <span class="stream-chart-scale__item">0:13</span>
                <span class="stream-chart-scale__item">0:17</span>
              </div>
          </div>
          <div class="stream-summary-data-wrapper">
            <div class="stream-summary-data-item stream-summary-data-item__duration">
              <div class="stream-summary-data-item__label">Duration</div>
              <div class="stream-summary-data-item__value">17s</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__viewers">
              <div class="stream-summary-data-item__label">Viewers</div>
              <div class="stream-summary-data-item__value">0</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__likes">
              <div class="stream-summary-data-item__label">Likes</div>
              <div class="stream-summary-data-item__value">0</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__tips">
              <div class="stream-summary-data-item__label">Funds</div>
              <div class="stream-summary-data-item__value">0</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__comments">
              <div class="stream-summary-data-item__label">Comments</div>
              <div class="stream-summary-data-item__value">0</div>
            </div>
          </div>
      </div>
      <label class="share-stream-label toggle-wrapper">
        Share your video for the next 24 hours so that more people can watch it.
        <div class="toggle-element">
          <input type="checkbox" class="share-stream">
          <span></span>
        </div>
      </label>
      <div class="mediasBottom" @click="close">
          <button class="btn alt lg change-devices">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Statistic",
  props: {
    close: {
      type: Function,
      isRequired: true
    }
  },
  computed: {
    comments() {
      return this.$store.state.lives.currentLive.statistic.stream_comment_search_all.data;
    },
    tips() {
      return this.$store.state.lives.currentLive.statistic.stream_tip_search_all.data;
    },
    likes() {
      return this.$store.state.lives.currentLive.statistic.stream_like_search_all.data;
    },
    looks() {
      return this.$store.state.lives.currentLive.statistic.stream_look_search_all.data;
    }
  }
};
</script>
