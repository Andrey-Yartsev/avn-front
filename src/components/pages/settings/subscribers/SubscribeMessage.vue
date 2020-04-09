<template>
  <div>
    <div class="form-title" :class="{ 'border-top': $mq === 'desktop' }">
      <div class="inner form-group form-group_clear-gaps option-star">
        <label class="toggle-label semi-transparent" for="im_star">
          Welcome Message
          <p class="subtext">
            Automatically send a custom message for new subscribers
          </p>
        </label>
        <label class="toggle-element">
          <input
            type="checkbox"
            id="im_star"
            name="isWantEarn"
            :disabled="dataEmpty"
            v-model="enabled"
          />
          <span class="toggle-element_switcher"></span>
        </label>
      </div>
    </div>
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Message</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <input
                  type="text"
                  class="checkPass"
                  name="text"
                  v-model="text"
                />
              </span>
            </span>
          </label>
        </div>
        <div class="form-group-btn">
          <button
            @click.prevent="save"
            :disabled="!isChanged"
            class="btn lg btn_fix-width"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";

export default {
  name: "SubscribeMessage",
  mixins: [userMixin],
  components: {
    Loader
  },
  data() {
    return {
      enabled: false,
      text: "",
      initSnapshot: null
    };
  },
  computed: {
    dataEmpty() {
      return !this.text;
    },
    isChanged() {
      if (this.dataEmpty || !this.initSnapshot) {
        return false;
      }
      if (
        this.enabled !== this.initSnapshot.enabled ||
        this.text !== this.initSnapshot.text
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    save() {
      this.$store.dispatch("profile/update", this.updatedUser()).then(() => {
        this.initSnapshot = {
          enabled: this.enabled,
          text: this.text
        };
      });
    },
    updatedUser() {
      const user = this.user;
      user.welcomeMessage = {
        enabled: this.enabled,
        text: this.text
      };
      return user;
    },
    init() {
      const { enabled, text } = this.user.welcomeMessage;
      this.enabled = enabled;
      this.text = text;
      this.initSnapshot = { enabled, text };
    }
  },
  mounted() {
    if (this.user.welcomeMessage) {
      this.init();
    } else {
      this.initSnapshot = { enabled: false, text: "" };
    }
  }
};
</script>
