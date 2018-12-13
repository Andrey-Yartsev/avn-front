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
            <div ref="chart">
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
            <div class="stream-chart-scale" v-if="false">
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
              <div class="stream-summary-data-item__value">{{ this.duration }}</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__viewers">
              <div class="stream-summary-data-item__label">Viewers</div>
              <div class="stream-summary-data-item__value">{{ this.looks.length }}</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__likes">
              <div class="stream-summary-data-item__label">Likes</div>
              <div class="stream-summary-data-item__value">{{ this.likes.length }}</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__tips">
              <div class="stream-summary-data-item__label">Funds</div>
              <div class="stream-summary-data-item__value">{{ this.tips.length }}</div>
            </div>
            <div class="stream-summary-data-item stream-summary-data-item__comments">
              <div class="stream-summary-data-item__label">Comments</div>
              <div class="stream-summary-data-item__value">{{ this.comments.length }}</div>
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
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  name: "Statistic",
  props: {
    close: {
      type: Function,
      isRequired: true
    },
    duration: {
      type: String,
      isRequired: true
    },
  },
  computed: {
    comments() {
      return this.$store.state.lives.currentLive.statistic
        .stream_comment_search_all.data;
    },
    tips() {
      return this.$store.state.lives.currentLive.statistic.stream_tip_search_all
        .data;
    },
    likes() {
      return this.$store.state.lives.currentLive.statistic
        .stream_like_search_all.data;
    },
    looks() {
      return this.$store.state.lives.currentLive.statistic
        .stream_look_search_all.data;
    }
  },
  methods: {
    buildChart(/* streamId, streamDuration, streamTimeStart */) {
      this.removeChart();

      // var bar_count = 47;
      // var scale_count = 4;
      // var scale_format = streamDuration < 3600 ? 'm:ss' : 'HH:mm:ss';

      // if (bar_count > streamDuration) {
      //   bar_count = streamDuration;
      // }

      // if (scale_count > streamDuration) {
      //   scale_count = streamDuration;
      // }

      // const stream_scale_unit = streamDuration / scale_count;
      // const stream_unit_time = streamDuration / bar_count;

      // let chart = am4core.create(this.$refs.chart, am4charts.XYChart);

      // chart.paddingRight = 20;

      // let data = [];
      // let visits = 10;
      // for (let i = 1; i < 366; i++) {
      //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      //   data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      // }

      // chart.data = data;

      // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // dateAxis.renderer.grid.template.location = 0;

      // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.tooltip.disabled = true;
      // valueAxis.renderer.minWidth = 35;

      // let series = chart.series.push(new am4charts.LineSeries());
      // series.dataFields.dateX = "date";
      // series.dataFields.valueY = "value";

      // series.tooltipText = "{valueY.value}";
      // chart.cursor = new am4charts.XYCursor();

      // let scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(series);
      // chart.scrollbarX = scrollbarX;

      // this.chart = chart;

      // const chart = AmCharts.makeChart('stream-chart', {
      //   'type': 'serial',
      //   'categoryField': 'date',
      //   'theme': 'default',
      //   'fontFamily': 'Open Sans',
      //   'color': '#7c8b96',
      //   'autoDisplay': false,
      //   'autoMargins': false,
      //   'marginBottom': 0,
      //   'marginTop': 0,
      //   'marginLeft': 0,
      //   'marginRight': 0,
      //   'categoryAxis': {
      //     'labelsEnabled': false,
      //     'axisColor': '#fff',
      //     'axisAlpha': .2,
      //     'startOnAxis': true,
      //     'gridAlpha': 0,
      //     'tickLength': 0
      //   },
      //   'valueAxes': [
      //     {
      //       'labelsEnabled': false,
      //       'axisThickness': 0,
      //       'dashLength': 6,
      //       'tickLength': 0,
      //       'gridAlpha': 0.1,
      //       'gridColor': '#7c8b96',
      //       'zeroGridAlpha': 0,
      //       'autoGridCount': false,
      //       'gridCount': 4
      //     }
      //   ],
      //   'graphs': [{
      //     'animationPlayed': true,
      //     'fillAlphas': 0.1,
      //     'lineColor': '#FF335A',
      //     'type': 'smoothedLine',
      //     'fillColors': ['#FF335A', 'rgba(0,0,0,0)'],
      //     'valueField': 'viewers',
      //     'lineThickness': 1.5
      //   }, {
      //     'animationPlayed': true,
      //     'fillAlphas': 0.1,
      //     'lineColor': '#ff9500',
      //     'fillColors': ['#ff9500', 'rgba(0,0,0,0)'],
      //     'type': 'smoothedLine',
      //     'valueField': 'likes',
      //     'lineThickness': 1.5
      //   }, {
      //     'animationPlayed': true,
      //     'fillAlphas': 0.1,
      //     'lineColor': '#67cc2e',
      //     'fillColors': ['#67cc2e', 'rgba(0,0,0,0)'],
      //     'type': 'smoothedLine',
      //     'valueField': 'tips',
      //     'lineThickness': 1.5
      //   }, {
      //     'animationPlayed': true,
      //     'fillAlphas': 0.1,
      //     'lineColor': '#3abfd3',
      //     'fillColors': ['#3abfd3', 'rgba(0,0,0,0)'],
      //     'type': 'smoothedLine',
      //     'valueField': 'comments',
      //     'lineThickness': 1.5
      //   }],
      //   'dataProvider': []
      // }
      // );
      // 	for (var i = 0; i < bar_count; i++) {
      // 		stream_chart.dataProvider.push({
      // 			'date': Math.round(streamTimeStart + i * stream_unit_time),
      // 			'viewers': 0,
      // 			'likes': 0,
      // 			'tips': 0,
      // 			'comments': 0
      // 		});
      // 	}
      // 	for (var i = 0; i <= scale_count; i++) {
      // 		document
      // 			.querySelector('.stream-chart-scale')
      // 			.insertAdjacentHTML('beforeend', '<span class=stream-chart-scale__item>' + moment.unix(Math.round(i * stream_scale_unit)).format(scale_format) + '</span>');
      // 	}
      // 	stream_chart.validateData();
      // 	onPing(function (data) {
      // 		if ('undefined' !== typeof data.statistics) {
      // 			if ('undefined' !== typeof SHOWED_STATISTICS[data.statistics.code] && SHOWED_STATISTICS[data.statistics.code] > data.statistics.time) {
      // 				return;
      // 			}
      // 			SHOWED_STATISTICS[data.statistics.code] = data.statistics.time;
      // 			switch (data.statistics.code) {
      // 				case 'stream_look_search_all':
      // 					var approx_arr = {};
      // 					data.statistics.data.forEach(function (item) {
      // 						var timestamp = moment(item.message.timestamp).format('X');
      // 						var curr_index = 0,
      // 							diff = 0;
      // 						for (var ii = 0; ii < bar_count; ii++) {
      // 							var moment_diff = Math.abs(stream_chart.dataProvider[ii].date - timestamp);
      // 							if (0 === ii || diff > moment_diff) {
      // 								diff = moment_diff;
      // 								curr_index = ii;
      // 							}
      // 						}
      // 						var val = 'undefined' !== typeof approx_arr[curr_index] ? approx_arr[curr_index] : 0;
      // 						approx_arr[curr_index] = val + 1;
      // 					});
      // 					for (var i in approx_arr) {
      // 						stream_chart.dataProvider[i].viewers = approx_arr[i];
      // 					}
      // 					stream_chart.validateData();
      // 					break;
      // 				case 'stream_like_search_all':
      // 					var approx_arr = {};
      // 					data.statistics.data.forEach(function (item) {
      // 						var timestamp = moment(item.message.timestamp).format('X');
      // 						var curr_index = 0,
      // 							diff = 0;
      // 						for (var ii = 0; ii < bar_count; ii++) {
      // 							var moment_diff = Math.abs(stream_chart.dataProvider[ii].date - timestamp);
      // 							if (0 === ii || diff > moment_diff) {
      // 								diff = moment_diff;
      // 								curr_index = ii;
      // 							}
      // 						}
      // 						var val = 'undefined' !== typeof approx_arr[curr_index] ? approx_arr[curr_index] : 0;
      // 						approx_arr[curr_index] = val + 1;
      // 					});
      // 					for (var i in approx_arr) {
      // 						stream_chart.dataProvider[i].likes = approx_arr[i];
      // 					}
      // 					stream_chart.validateData();
      // 					break;
      // 				case 'stream_comment_search_all':
      // 					var approx_arr = {};
      // 					data.statistics.data.forEach(function (item) {
      // 						var timestamp = moment(item.message.timestamp).format('X');
      // 						var curr_index = 0,
      // 							diff = 0;
      // 						for (var ii = 0; ii < bar_count; ii++) {
      // 							var moment_diff = Math.abs(stream_chart.dataProvider[ii].date - timestamp);
      // 							if (0 === ii || diff > moment_diff) {
      // 								diff = moment_diff;
      // 								curr_index = ii;
      // 							}
      // 						}
      // 						var val = 'undefined' !== typeof approx_arr[curr_index] ? approx_arr[curr_index] : 0;
      // 						approx_arr[curr_index] = val + 1;
      // 					});
      // 					for (var i in approx_arr) {
      // 						stream_chart.dataProvider[i].comments = approx_arr[i];
      // 					}
      // 					stream_chart.validateData();
      // 					break;
      // 				case 'stream_tip_search_all':
      // 					var approx_arr = {};
      // 					data.statistics.data.forEach(function (item) {
      // 						var timestamp = moment(item.message.timestamp).format('X');
      // 						var curr_index = 0,
      // 							diff = 0;
      // 						for (var ii = 0; ii < bar_count; ii++) {
      // 							var moment_diff = Math.abs(stream_chart.dataProvider[ii].date - timestamp);
      // 							if (0 === ii || diff > moment_diff) {
      // 								diff = moment_diff;
      // 								curr_index = ii;
      // 							}
      // 						}
      // 						var val = 'undefined' !== typeof approx_arr[curr_index] ? approx_arr[curr_index] : 0;
      // 						approx_arr[curr_index] = val + 1;
      // 					});
      // 					for (var i in approx_arr) {
      // 						stream_chart.dataProvider[i].tips = approx_arr[i];
      // 					}
      // 					stream_chart.validateData();
      // 					break;
      // 			}
      // 		}
      // 	});
      // 	// getUserStatistics('stream_look_search_all', {
      // 	// 	stream_id: streamId
      // 	// });
      // 	// getUserStatistics('stream_like_search_all', {
      // 	// 	stream_id: streamId
      // 	// });

      // 	if (ENABLE_CHAT_SERVICE) {
      // 		StreamComments.getStats(function (response) {
      // 			var approx_arr = {};
      // 			response.messages.forEach(function (item) {
      // 				var timestamp = moment(item.date).format('X');
      // 				var curr_index = 0;
      // 				var diff = 0;
      // 				for (var ii = 0; ii < bar_count; ii++) {
      // 					var moment_diff = Math.abs(stream_chart.dataProvider[ii].date - timestamp);
      // 					if (0 === ii || diff > moment_diff) {
      // 						diff = moment_diff;
      // 						curr_index = ii;
      // 					}
      // 				}
      // 				var val = 'undefined' !== typeof approx_arr[curr_index] ? approx_arr[curr_index] : 0;
      // 				approx_arr[curr_index] = val + item.count;
      // 			});

      // 			for (var i in approx_arr) {
      // 				stream_chart.dataProvider[i].comments = approx_arr[i];
      // 			}
      // 			stream_chart.validateData();
      // 		});
      // 	} else {
      // 		getUserStatistics('stream_comment_search_all', {
      // 			stream_id: streamId
      // 		});
      // 	}

      // 	getUserStatistics('stream_tip_search_all', {
      // 		stream_id: streamId
      // 	});
    },
    removeChart() {
      if (this.chart) {
        this.chart.dispose();
      }
    }
  },
  mounted() {
    this.buildChart();
  },
  beforeDestroy() {
    this.removeChart();
  },
  watch: {
    comments() {
      this.buildChart();
    },
    tips() {
      this.buildChart();
    },
    likes() {
      this.buildChart();
    },
    looks() {
      this.buildChart();
    }
  }
};
</script>
