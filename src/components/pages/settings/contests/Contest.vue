<template>
  <tbody>
    <tr>
      <td>{{ data.name }}</td>
      <td>{{ data.modelData.rank }}</td>
      <td>{{ getDate(data.starts_at) }} - {{ getDate(data.ends_at) }}</td>
      <td class="toggler">
        <label class="toggle-element">
          <input type="checkbox" id="subscribedOffline" v-model="opened" />
          <span class="toggle-element_switcher"></span>
        </label>
      </td>
    </tr>
    <tr v-if="opened">
      <td colspan="4">
        <div class="edit">
          <form @submit.prevent="update">
            <div
              class="contestImagePreview"
              :class="{ 'full-width': $mq === 'mobile' }"
              v-if="hasImagePreview"
            >
              <img :src="getImagePreview" alt="preview" />
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
                      rows="3"
                      name="description"
                      maxlength="500"
                      style="resize: none; overflow: hidden; height: 50px;"
                      v-model="currentData.modelData.description"
                    >
                    </textarea>
                  </span>
                </span>
              </label>
            </div>

            <div
              class="form-group form-group_with-label"
              v-if="isTwitterConnected"
            >
              <div class="form-group-inner form-group-title twitterConnect">
                <span class="label">Connect Twitter</span>

                <template>
                  <span
                    class="value twitter-value hidden-desktop"
                    v-if="$mq === 'mobile'"
                  >
                    <a
                      :href="'https://twitter.com/' + isTwitterConnected"
                      target="_blank"
                      rel="nofollow"
                      >{{ isTwitterConnected }}</a
                    >
                  </span>
                  <input
                    class="rounded twitter-input hidden-mobile"
                    type="text"
                    readonly=""
                    :value="'@' + isTwitterConnected"
                    v-if="$mq === 'desktop'"
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
              </div>
            </div>

            <div class="form-group-btn">
              <button
                type="submit"
                class="btn lg btn_fix-width-sm"
                :disabled="!valid || isSending"
              >
                Save
              </button>
            </div>
          </form>

          <!--
          <div class="form-group form-group_with-label promote">
            <div class="form-group-inner form-group-title">
              <span class="label">Promote Contest</span>
              <div class="input">http://asd</div>
              <button
                type="button"
                class="btn border disconnect-twitter semi-transparent"
              >
                Copy
              </button>
            </div>
          </div>
          -->

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
      </td>
    </tr>
  </tbody>
</template>

<script>
import moment from "moment";

export default {
  props: ["data"],
  data() {
    return {
      opened: false,
      currentData: {},
      formData: null,
      imageSelected: false,
      image: null,
      showTwitter: false,
      imagePreview: null,
      isSending: false
    };
  },
  computed: {
    valid() {
      return (
        this.currentData.description &&
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
      return moment(date).format("MMM D, hh:mm a");
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
          console.log(err);
        })
        .finally(() => {
          this.isSending = false;
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.contestImagePreview {
  padding-right: 11.5%;
  img {
    width: 67.5%;
    height: 200px;
    object-fit: cover;
    display: block;
    margin: 10px 0 10px auto;
  }
  &.full-width {
    padding-right: 0;
    img {
      width: 100%;
    }
  }
}
.twitter-input {
  margin-right: 20px;
}
.twitterConnect {
  align-items: center;
}
</style>
