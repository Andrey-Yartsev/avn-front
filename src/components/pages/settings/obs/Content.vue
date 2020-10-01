<template>
  <div class="SettingsObsView">
    <h1 class="form-title settings-title">
      OBS Settings
    </h1>
    <div
      class="shadow-block border-top shadow-block_section"
      :class="{ 'shadow-block_b-gap-md': $mq === 'mobile' }"
    >
      <div class="container">
        <p class="text-obs-settings">
          We support RTMP protocol for streaming. You can use free and
          open-source software suite OBS Studio for recording and live
          streaming.
        </p>
        <div class="download-apps">
          <a
            href="https://obsproject.com/download"
            target="_blank"
            class="download-app"
          >
            <span class="download-app__logo logo-obs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path
                  d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M43.765,34.373 c1.267-3.719-0.131-8.03-3.567-10.23c-4.024-2.576-9.374-1.401-11.95,2.623h0c-1.854,2.896-1.756,6.474-0.061,9.215 c-1.009,1.556-2.369,2.917-4.07,3.931c-5.4,3.22-12.356,1.952-16.225-2.779c-0.186-0.262-0.367-0.527-0.541-0.797 c2.62,3.273,7.404,4.213,11.166,2.09c4.161-2.348,5.631-7.625,3.283-11.786v0c-1.618-2.867-4.627-4.456-7.703-4.399 c-0.994-1.792-1.563-3.852-1.563-6.047c0-5.482,3.537-10.119,8.448-11.8c0.36-0.07,0.728-0.116,1.094-0.168 c-3.321,1.208-5.698,4.384-5.698,8.123c0,4.778,3.873,8.651,8.651,8.651c3.179,0,5.949-1.719,7.453-4.274 c2.197,0.015,4.417,0.594,6.427,1.825c5.056,3.094,7.173,9.294,5.39,14.713C44.137,33.643,43.948,34.007,43.765,34.373z"
                />
              </svg>
            </span>
            <span class="download-app__title">
              Download
            </span>
          </a>
        </div>
      </div>
    </div>
    <div class="form-title border-top">
      <div class="inner">
        <span class="semi-transparent">
          Settings
        </span>
      </div>
    </div>
    <div
      class="shadow-block shadow-block_section"
      :class="{ 'shadow-block_b-gap-md': $mq === 'mobile' }"
    >
      <div class="container">
        <div
          class="form-group form-group_with-label"
          :class="{ 'pb-reset': $mq === 'desktop' }"
        >
          <label class="form-group-inner">
            <span class="label">OBS server URL</span>
            <span class="form-group form-group_min-height">
              <span class="form-field">
                {{ server }}
              </span>
            </span>
            <button
              type="button"
              class="btn btn_fix-width-ex-sm border alt"
              @click="copyServerToClipboard"
            >
              Copy
            </button>
          </label>
        </div>
        <div
          class="form-group form-group_with-label"
          :class="{ 'pb-reset': $mq === 'desktop' }"
        >
          <label class="form-group-inner">
            <span class="label">OBS streaming key</span>
            <span class="form-group form-group_min-height">
              <span class="form-field form-field_break-all">
                {{ key }}
              </span>
            </span>
            <button
              type="button"
              class="btn btn_fix-width-ex-sm border alt"
              @click="copyKeyToClipboard"
            >
              Copy
            </button>
          </label>
        </div>
        <div
          class="form-group form-group_with-label"
          :class="{ 'pb-reset': $mq === 'desktop' }"
        >
          <div class="form-group-inner">
            <span class="label">Internal chat URL</span>
            <span class="form-group form-group_min-height">
              <span class="form-field form-field_break-all">
                <a :href="url" target="_blank">{{ url }}</a>
              </span>
            </span>
            <button
              type="button"
              class="btn btn_fix-width-ex-sm border alt"
              @click="copyUrlToClipboard"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="form-title border-top">
      <div class="inner">
        <span class="semi-transparent">
          Instructions for starting & manage OBS stream
        </span>
      </div>
    </div>
    <div
      class="shadow-block shadow-block_section"
      :class="{ 'shadow-block_b-gap-md': $mq === 'mobile' }"
    >
      <div class="container">
        <div class="download-apps">
          <a
            :href="getStaticLink('winObs')"
            target="_blank"
            class="download-app"
          >
            <span class="download-app__logo logo-windows">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 475.082 475.082"
              >
                <g>
                  <g>
                    <polygon
                      points="0,409.705 194.716,436.541 194.716,250.677 0,250.677 		"
                    />
                    <polygon
                      points="0,226.692 194.716,226.692 194.716,38.544 0,65.38 		"
                    />
                    <polygon
                      points="216.129,439.398 475.082,475.082 475.082,250.677 475.082,250.674 216.129,250.674 		"
                    />
                    <polygon
                      points="216.132,35.688 216.132,226.692 475.082,226.692 475.082,0 		"
                    />
                  </g>
                </g>
              </svg>
            </span>
            <span class="download-app__title">
              for Windows
            </span>
          </a>
          <a
            :href="getStaticLink('macObs')"
            target="_blank"
            class="download-app"
          >
            <span class="download-app__logo logo-apple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 475.088 475.088"
              >
                <g>
                  <g>
                    <path
                      d="M391.29,310.91c-13.135-18.842-19.698-40.07-19.698-63.666c0-21.508,6.194-41.213,18.556-59.102
                        c6.662-9.707,17.514-20.934,32.551-33.689c-9.896-12.178-19.793-21.695-29.697-28.549c-17.891-12.37-38.164-18.555-60.812-18.555
                        c-13.511,0-29.979,3.234-49.389,9.71c-18.654,6.471-32.265,9.71-40.826,9.71c-6.475,0-19.606-2.853-39.401-8.566
                        c-19.985-5.711-36.831-8.564-50.535-8.564c-32.738,0-59.766,13.706-81.083,41.112c-21.508,27.79-32.264,63.382-32.264,106.78
                        c0,46.062,13.993,93.928,41.971,143.607c28.358,49.297,57.005,73.949,85.936,73.949c9.707,0,22.27-3.237,37.685-9.708
                        c15.42-6.276,28.933-9.421,40.545-9.421c12.368,0,26.741,3.045,43.109,9.133c17.319,6.085,30.646,9.131,39.971,9.131
                        c24.362,0,48.824-18.654,73.374-55.959c15.985-23.791,27.692-47.582,35.115-71.376C419.458,341.744,404.424,329.753,391.29,310.91
                        z"
                    />
                    <path
                      d="M294.213,90.219c11.994-11.991,20.844-25.126,26.556-39.399c5.517-14.275,8.271-27.22,8.271-38.832
                        c0-0.759-0.041-1.712-0.144-2.855c-0.086-1.142-0.137-2.091-0.137-2.853c-0.192-0.572-0.428-1.619-0.712-3.14
                        c-0.284-1.521-0.521-2.568-0.716-3.14c-33.499,7.808-57.29,21.892-71.376,42.259c-14.271,20.557-21.698,45.013-22.27,73.373
                        c12.753-1.143,22.646-2.758,29.692-4.853C273.663,107.352,283.929,100.497,294.213,90.219z"
                    />
                  </g>
                </g>
              </svg>
            </span>
            <span class="download-app__title">
              for Mac
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObsSettingsContent",
  computed: {
    server() {
      return this.$store.state.init.data.obsStreamingServer;
    },
    key() {
      return this.$store.state.auth.user.streamingObsKey;
    },
    url() {
      return window.location.origin + "/stream/obs";
    }
  },
  methods: {
    copyServerToClipboard() {
      this.$copyText(this.server).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "OBS Server URL copied!"
        });
      });
    },
    copyKeyToClipboard() {
      this.$copyText(this.key).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "OBS key copied!"
        });
      });
    },
    copyUrlToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "URL copied!"
        });
      });
    },
    getStaticLink(key) {
      return this.$store.state.init.data.staticDocs[key];
    }
  }
};
</script>
