<template>
  <div class="stream-container" :class="{stream_enabled: isStarted}">
    <div class="loader-container" v-if="!user">
      <Loader :fullscreen="false" text="" class="transparent small" />
    </div>
    <div class="stream " v-else>
        <div class="mediasTop">
          <div class="mediasTop__header">
            <span class="category-name category-name_live hidden-mobile">Live video</span>
            <button class="close" @click="close">
              <span class="category-name category-name_live hidden-desktop">Live Video</span>
            </button>
            <div class="mediasHeaderControls">
              <button class="btn alt sm change-devices top" @click="startStream">Start</button>
              <button id="stop" class="btn alt sm change-devices top" @click="close">Stop</button>
            </div>
              <div class="group-controls">
                <div id="devices">
                    <div
                      v-click-outside="hideStreamVisibilityMenu"
                      :class="[
                        'btn-media-event has-dropdown stream-visibility',
                        streamVisibility.key,
                        {
                          shown: shownStreamVisibilityMenu
                        }
                      ]"
                      v-if="user"
                    >
                      <button type="button" class="root-btn" @click="showStreamVisibilityMenu">
                        <span class="root-btn__inside">{{ streamVisibility.label }}</span>
                      </button>
                      <div class="menu">
                        <button
                          type="button"
                          v-for="streamVisib in streamVisibilities"
                          v-bind:key="streamVisib.key"
                          :class="['item', { active: streamVisibility.key === streamVisib.key }]"
                          @click="() => setStreamVisibility(streamVisib)"
                          :disabled="streamVisib.disabled"
                        >
                          <span class="value">{{ streamVisib.label }}</span>
                        </button>
                      </div>
                    </div>
                    <div
                      v-if="streamVideo"
                      v-click-outside="hideStreamVideoMenu"
                      :class="[
                        'btn-media-event has-dropdown camera',
                        {
                          shown: shownStreamVideoMenu,
                          'device-disabled': streamVideo.deviceId === 'disabled'
                        }
                    ]">
                      <button type="button" class="root-btn" @click="showStreamVideoMenu">
                        <span class="root-btn__inside" />
                      </button>
                      <div class="menu">
                        <button
                          v-for="video in streamVideos"
                          v-bind:key="video.deviceId"
                          type="button"
                          :data-type="video.deviceId"
                          :class="['item', { active: streamVideo.deviceId === video.deviceId }]"
                          @click="() => setStreamVideo(video)"
                        >
                          <span class="value">{{ video.label }}</span>
                        </button>
                      </div>
                    </div>
                    <div
                      v-if="streamAudio"
                      v-click-outside="hideStreamAudioMenu"
                      :class="[
                        'btn-media-event has-dropdown microphone',
                        {
                          shown: shownStreamAudioMenu,
                          'device-disabled': streamAudio.deviceId === undefined
                        }
                      ]">
                      <button type="button" class="root-btn" @click="showStreamAudioMenu">
                        <span class="root-btn__inside" />
                      </button>
                      <div class="menu">
                        <button
                          v-for="audio in streamAudios"
                          v-bind:key="audio.deviceId"
                          type="button"
                          :data-type="audio.deviceId"
                          :class="['item', { active: streamAudio.deviceId === audio.deviceId }]"
                          @click="() => setStreamAudio(audio)"
                        >
                          <span class="value">{{ audio.label || "Disable Microphone" }}</span>
                        </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="videos">
          <div class="stream-video-container" id="videoleft">
            <video
              class="rounded centered"
              id="myvideo"
              autoplay=""
              muted=""
              playsinline=""
            />
          </div>
          <div id="stream-timer">{{ time }}</div>
          <div class="stream-online-label">live</div>
          <div class="stream-comments-wrapper" v-if="false">
            <div class="item">
              <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
              <span class="name">Glance Shifter</span>
              <span class="text">Hi, my friends</span>
            </div>
            <div class="item">
              <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
              <span class="name">Glance Shifter</span>
              <span class="text">Hi, my friends</span>
            </div>
            <div class="item">
              <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
              <span class="name">Glance Shifter</span>
              <span class="text">Hi, my friends</span>
            </div>
            <div class="item">
              <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
              <span class="name">Glance Shifter</span>
              <span class="text">Hi, my friends</span>
            </div>
            <div class="item">
              <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
              <span class="name">Glance Shifter</span>
              <span class="text">Hi, my friends</span>
            </div>
          </div>
          <form class="stream-comment-form" v-if="false">
              <input type="text" placeholder="Comment" class="stream-comment-input rounded lg" maxlength="24">
              <button type="button" class="stream-comment-send-btn" disabled=""></button>
          </form>
          <div class="stream-btns stream-viewer-btns" v-if="false">
              <span role="button" class="stream-comment-btn"></span>
              <span class="stream-like-btn"></span>
              <span class="stream-tip-btn"></span>
              <span class="stream-online-count">176</span>
          </div>
        </div>
        <div v-if="false">
          Bitrate
          <select id="bitrateset">
            <option value="0">No limit</option>
            <option value="128">Cap to 128kbit</option>
            <option value="256">Cap to 256kbit</option>
            <option value="512">Cap to 512kbit</option>
            <option value="1024">Cap to 1mbit</option>
            <option value="1500">Cap to 1.5mbit</option>
            <option value="2000">Cap to 2mbit</option>
          </select>
        </div>
        <div class="mediasBottom">
          <button
            class="btn alt lg change-devices"
            @click="startStream"
          >Start live video</button>
        </div>
    </div>

    <div class="popup" style="display: none;">
      <div class="overlay"></div>
      <div class="popup-container popup-alert">
        <div class="popup-alert__msg">
            Live video has ended
        </div>
        <div class="popup-alert__btn">
          <button class="btn lg">Close</button>
        </div>
      </div>
    </div>

    <div class="popup">
      <div class="overlay"></div>
      <div class="stream-summary-container">
        <div class="stream-chart-legend">
          <div class="stream-chart-legend-item stream-chart-legend-item__viewers">
            <span class="stream-chart-legend-item-label">Viewers</span>
            <span class="stream-chart-legend-item-value">0</span>
          </div>
          <div class="stream-chart-legend-item stream-chart-legend-item__likes">
            <span class="stream-chart-legend-item-label">Likes</span>
            <span class="stream-chart-legend-item-value">0</span>
          </div>
          <div class="stream-chart-legend-item stream-chart-legend-item__tips">
            <span class="stream-chart-legend-item-label">Tips</span>
            <span class="stream-chart-legend-item-value">0</span>
          </div>
          <div class="stream-chart-legend-item stream-chart-legend-item__comments">
            <span class="stream-chart-legend-item-label">Comments</span>
            <span class="stream-chart-legend-item-value">0</span>
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
                <div class="stream-summary-data-item__label">Tips</div>
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
        <div class="mediasBottom">
            <button class="btn alt lg change-devices">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";
import Streams from "streaming-module/stream_module";
import StreamApi from "@/api/stream";
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamPage",
  directives: {
    ClickOutside
  },
  mixins: [userMixin],
  data() {
    return {
      streamVisibility: {},
      shownStreamVisibilityMenu: false,

      streamVideos: undefined,
      streamVideo: undefined,
      shownStreamVideoMenu: false,

      streamAudios: undefined,
      streamAudio: undefined,
      shownStreamAudioMenu: false,

      isReadyToStart: false,
      isStarted: false,
      time: undefined,
      startedStreamId: undefined
    };
  },
  components: {
    Loader
  },
  computed: {
    streamVisibilities() {
      return [
        {
          key: "subscribers",
          label: "Subscribers only",
          disabled: !this.canEarnMoney
        },
        {
          key: "followers",
          label: "Followers only",
          disabled: false
        },
        {
          key: "public",
          label: "Everyone",
          disabled: false
        }
      ];
    }
  },
  methods: {
    showStreamVisibilityMenu() {
      this.shownStreamVisibilityMenu = true;
    },
    hideStreamVisibilityMenu() {
      this.shownStreamVisibilityMenu = false;
    },
    setStreamVisibility(value) {
      this.streamVisibility = value;
      this.shownStreamVisibilityMenu = false;
    },

    showStreamVideoMenu() {
      this.shownStreamVideoMenu = true;
    },
    hideStreamVideoMenu() {
      this.shownStreamVideoMenu = false;
    },
    setStreamVideo(value) {
      Streams.switchDevices(false, value.deviceId);
      this.streamVideo = value;
      this.shownStreamVideoMenu = false;
    },

    showStreamAudioMenu() {
      this.shownStreamAudioMenu = true;
    },
    hideStreamAudioMenu() {
      this.shownStreamAudioMenu = false;
    },
    setStreamAudio(value) {
      Streams.switchDevices(value.deviceId, false);
      this.streamAudio = value;
      this.shownStreamAudioMenu = false;
    },

    onDevicesReadyCallback() {
      const {
        audioDevices,
        /* defaultAudioDevice, */
        videoDevices,
        defaultVideoDevice
      } = Streams.getDevices();

      this.isReadyToStart = true;

      this.streamVideos = videoDevices;
      this.streamVideo = defaultVideoDevice;
      this.streamAudios = audioDevices;
      this.streamAudio = audioDevices[1];
    },
    tick(start) {
      const diff = Math.round(new Date().getTime() / 1000) - start;
      const date = new Date(diff * 1000);
      let hours = date.getHours();
      let mins = date.getMinutes();
      let secs = date.getSeconds();
      hours = hours < 10 ? `0${hours}` : `${hours}`;
      mins = mins < 10 ? `0${mins}` : `${mins}`;
      secs = secs < 10 ? `0${secs}` : `${secs}`;
      this.time =
        diff > 3600 ? hours + ":" + mins + ":" + secs : mins + ":" + secs;
    },
    startStream() {
      this.isReadyToStart = false;
      this.isStarted = true;
      Streams.startStream();
    },
    stopStream() {
      Streams.stopStreaming();
    },
    close() {
      if (this.isStarted) {
        this.stopStream();
      } else {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this.streamVisibility =
      this.user.subscribePrice > 0
        ? this.streamVisibilities[0]
        : this.streamVisibilities[1];

    const { onDevicesReadyCallback } = this;
    const token = this.$store.state.auth.token;
    window.Streams = Streams;
    Streams.init({
      thumbEnabled: true,
      videoSave: true,
      getApiUrl: StreamApi.getStreamPath(token),
      clientGetApiUrl: "https://gpu3.view.me/webrtc-api",
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      streamSource: "client",
      showLikes: false,
      showMessage(message) {
        // eslint-disable-next-line
        console.log(message);
      },
      onLocalStreamInit() {},
      onRemoteStreamInit() {},
      onStreamError(error) {
        // eslint-disable-next-line
        console.error(error);
        Streams.config.onStreamEnd();
      },
      onStreamTick: start => {
        this.tick(start);
      },
      onStreamStart: room => {
        const type = this.streamVisibility.key;

        StreamApi.runStream({
          room,
          type
        })
          .then(res => {
            return res.json();
          })
          .then(({ id }) => {
            this.startedStreamId = id;
            Streams.config.clientGetApiUrl = `https://team2.retloko.com/api2/v2/streams/${id}/url?access-token=${token}`;
          });
      },
      onStreamEnd: () => {
        this.time = undefined;
        this.isReadyToStart = true;
        this.isStarted = false;
        StreamApi.deleteStream(this.startedStreamId);
        this.startedStreamId = undefined;
      },
      onCleanUp() {},
      onViewersCountGet(/* count */) {},
      onCustomDataGet(/* message */) {},
      onDevicesReadyCallback
    });
  },
  beforeDestroy() {
    Streams.stopAllTracks(Streams.localStream);
  }
};
</script>
