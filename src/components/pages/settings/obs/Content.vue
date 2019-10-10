<template>
  <div class="SettingsObsView">
    <h1 class="form-title settings-title">
      OBS Settings
    </h1>
    <div class="shadow-block border-top">
      <div class="container">
        <div class="form-group form-group_with-label pb-reset">
          <label class="form-group-inner">
            <span class="label">OBS server URL</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                {{ server }}
              </span>
            </span>
          </label>
        </div>
        <div class="form-group form-group_with-label pb-reset">
          <label class="form-group-inner">
            <span class="label">OBS streaming key</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                {{ key }}
              </span>
            </span>
          </label>
        </div>
        <div class="form-group form-group_with-label pb-reset">
          <label class="form-group-inner">
            <span class="label">Internal chat URL</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                {{ url }}
              </span>
            </span>
            <button
              type="button"
              class="btn btn_fix-width-sm border alt btn-copy-url"
              @click="copyToClipboard"
            >
              Copy
            </button>
          </label>
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
    copyToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "URL copied!"
        });
      });
    }
  }
};
</script>
