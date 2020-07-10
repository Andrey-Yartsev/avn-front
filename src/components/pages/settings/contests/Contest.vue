<template>
  <div class="contest-table-body border-top">
    <div class="contest-table-row">
      <router-link
        :to="`/contests/${data.id}`"
        class="contest-row-name"
        :event="!data.hasFinished ? 'click' : ''"
      >
        {{ data.name }}{{ data.hasFinished ? " (finished)" : "" }}
        <br />
        <span class="contest-row-date semi-transparent"
          >{{ getDate(data.starts_at) }} - {{ getDate(data.ends_at) }}</span
        >
      </router-link>
      <div class="contest-row-rank">
        {{ data.modelData.rank ? `#${data.modelData.rank}` : "" }}
      </div>
      <div class="contest-row-toggler">
        <label class="toggle-element">
          <input
            type="checkbox"
            id="subscribedOffline"
            v-model="opened"
            :disabled="data.hasFinished"
          />
          <span
            class="toggle-element_switcher"
            :class="{ disabled: data.hasFinished }"
          ></span>
        </label>
      </div>
    </div>
    <div class="contest-table-details" v-if="opened">
      <p class="finished-title" v-if="data.hasFinished">
        Contest has finished already
      </p>
      <div class="edit">
        <form @submit.prevent="update">
          <div class="contestImagePreview" v-if="hasImagePreview">
            <div
              class="image"
              :style="`background-image: url(${getImagePreview})`"
            />
          </div>
          <div
            class="form-group-inner form-group_with-label"
            :class="{ 'success icn-item': imageSelected }"
          >
            <span class="label">Upload Image</span>
            <div class="photo-label-wrapper">
              <label
                :for="`personalIdImage-${data.id}`"
                class="btn btn_fix-width btn_block border photo-btn"
                >Choose</label
              >
            </div>
            <input
              type="file"
              :id="`personalIdImage-${data.id}`"
              accept=".jpg,.jpeg,.png"
              ref="image"
              name="image"
              @change="handleImageChoose"
            />
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Description</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <textarea
                    rows="5"
                    name="description"
                    maxlength="100"
                    style="resize: none; overflow: auto; height: auto; font-size: 12px"
                    v-model="currentData.modelData.description"
                  >
                  </textarea>
                </span>
              </span>
            </label>
          </div>

          <div class="form-group form-group_with-label">
            <div class="form-group-inner form-group-title twitterConnect">
              <span class="label">{{
                isTwitterConnected ? "Twitter" : "Connect Twitter"
              }}</span>

              <template v-if="isTwitterConnected">
                <input
                  class="rounded twitter-input"
                  type="text"
                  readonly=""
                  :value="'@' + isTwitterConnected"
                />
                <label class="toggle-element">
                  <input
                    type="checkbox"
                    id="subscribedOffline"
                    v-model="showTwitter"
                  />
                  <span class="toggle-element_switcher"></span>
                </label>
              </template>
              <button
                v-else
                type="button"
                class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter"
                @click="twitterConnect"
              >
                Connect Twitter account
              </button>
            </div>
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width-sm"
              :disabled="!valid || isSending || data.hasFinished"
            >
              Save
            </button>
          </div>
        </form>

        <div
          class="form-group form-group_with-label promote"
          v-if="showPromoteLink"
        >
          <div class="form-group-inner">
            <span class="label">Promote Contest</span>
            <span class="input">{{ promoteContestLink() }}</span>
            <button
              type="button"
              class="btn border semi-transparent copy-link"
              @click="copyContestLink"
            >
              Copy
            </button>
          </div>
        </div>

        <div class="supporters" v-if="data.topSupporters.length">
          <div>
            <table>
              <tr>
                <th>Top Supporters</th>
                <th>Amount</th>
              </tr>
              <tr v-for="v in data.topSupporters" :key="v.username">
                <td>{{ v.name }}</td>
                <td>${{ v.amount }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import Twitter from "@/utils/twitter";

export default {
  props: ["data"],
  data() {
    return {
      opened: false,
      currentData: {},
      formData: null,
      imageSelected: false,
      image: null,
      showTwitter: true,
      imagePreview: null,
      isSending: false
    };
  },
  computed: {
    valid() {
      return !!(
        this.currentData.modelData.description &&
        (this.imageSelected || this.currentData.modelData?.image_url)
      );
    },
    isTwitterConnected() {
      return this.$store.state.auth.user.twitterUsername;
    },
    hasImagePreview() {
      return !!this.currentData.modelData?.image_url || !!this.image;
    },
    getImagePreview() {
      if (!this.image) {
        return this.currentData.modelData?.image_url;
      }
      return this.imagePreview;
    },
    showPromoteLink() {
      return (
        this.data.is_voting_active &&
        !this.data.hasFinished &&
        this.currentData.modelData?.nominee_id
      );
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    opened(value) {
      if (!value && this.currentData.modelData.nominee_id) {
        this.contestRemove();
      }
    }
  },
  methods: {
    init() {
      this.currentData = {
        ...this.data,
        modelData: {
          category_id: this.data.modelData?.category_id || null,
          contest_id: this.data.modelData?.contest_id || null,
          description: this.data.modelData?.description || "",
          image_url: this.data.modelData?.image_url || "",
          nominee_id: this.data.modelData?.nominee_id || null,
          rank: this.data.modelData?.rank || null,
          rank_display: this.data.modelData?.rank || false,
          twitter_handle: this.data.modelData?.twitter_handle || ""
        }
      };
      this.formData = new FormData();
      if (this.data.modelData?.contest_id) {
        this.opened = true;
      }
      if (this.data.modelData?.twitter_handle) {
        this.showTwitter = true;
      }
    },
    getDate(date) {
      if (!date) {
        return "";
      }
      const str = moment(date)
        .tz(this.data.timezone)
        .format("MMM D, hh:mm a");
      return str + " PDT";
    },
    handleImageChoose(event) {
      const files = event.target.files;
      if (!files.length) {
        this.formData.delete("image");
        this.image = null;
        this.imageSelected = false;
        return;
      }
      this.formData.append("image", files[0]);
      this.image = files[0];
      this.convertFileToImage(files[0]);
      this.imageSelected = true;
    },
    convertFileToImage(file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    },
    contestRemove() {
      this.$store
        .dispatch("contest/remove", {
          contestId: this.data.id,
          nomineeId: this.currentData.modelData.nominee_id
        })
        .then(() => {
          this.$store.dispatch("global/flashToast", {
            text: "You has been removed yourself from the contest",
            type: "warning"
          });
          this.currentData.modelData = {
            category_id: null,
            contest_id: null,
            description: "",
            image_url: "",
            nominee_id: null,
            rank: null,
            rank_display: false,
            twitter_handle: ""
          };
          this.image = null;
        });
    },
    update() {
      this.formData.append("description", this.currentData.description);
      const data = {
        description: this.currentData.modelData.description,
        image: this.image || this.currentData.modelData?.image_url
      };
      if (this.isTwitterConnected && this.showTwitter) {
        data.twitter = this.$store.state.auth.user.twitterUsername;
      }
      this.isSending = true;
      this.$store
        .dispatch("contest/update", {
          contestId: this.data.id,
          body: data
        })
        .then(res => {
          this.currentData.modelData.nominee_id = res.id;
          this.$store.dispatch("global/flashToast", {
            text: "Contest data has been updated!",
            type: "success"
          });
        })
        .catch(err => {
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    twitterConnect() {
      window.location.href = Twitter.getConnectUrl("/settings/account");
    },
    promoteContestLink() {
      return `${window.location.origin}/${this.user.username}/c/${
        this.data.id
      }/${this.user.id}`;
    },
    copyContestLink() {
      this.$copyText(this.promoteContestLink())
        .then(() => {
          this.$store.dispatch("global/flashToast", {
            text: "Contest link copied"
          });
        })
        .catch(() => {
          this.$store.dispatch("global/flashToast", {
            text: "There was a problem. Copy manual please",
            error: true
          });
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
