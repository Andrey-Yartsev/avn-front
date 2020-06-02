<template>
  <div class="settings-wrapper rounded-container pos-relative">
    <div
      class="border-top shadow-block loader-container loader-container_center"
      v-if="loading"
    >
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </div>

    <div v-else>
      <h1 class="form-title settings-title">
        Welcome Messages
      </h1>
      <div
        class="toggle-wrapper form-title border-top"
        :class="{
          disabled:
            settings.subscribers.isEditMode ||
            !data.subscribers.text.trim().length
        }"
      >
        <div class="inner">
          <label for="subscribed" class="toggle-label semi-transparent">
            Automatically send a custom message for new subscribers
          </label>
          <label class="toggle-element">
            <input
              type="checkbox"
              id="subscribed"
              :checked="data.subscribers.enabled"
              v-model="data.subscribers.enabled"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div class="shadow-block section">
        <div class="container">
          <MessageInfo
            :type="'subscribers'"
            :info="data.subscribers"
            :settings="settings.subscribers"
            :dataChanged="isSubscribersDataChanged"
            @save="save('subscribers')"
            @deleteImage="data.subscribers.image = null"
            @setImagePreview="
              path => (settings.subscribers.imagePreview = path)
            "
            @setImagePath="path => (settings.subscribers.imagePath = path)"
            class="existing-subscription"
          />
        </div>
        <button @click="togleMode('subscribers')" class="btn-address-edit">
          {{ settings.subscribers.isEditMode ? "View" : "Edit" }}
        </button>
      </div>

      <div
        class="toggle-wrapper form-title border-top"
        :class="{
          disabled:
            settings.followers.isEditMode || !data.followers.text.trim().length
        }"
      >
        <div class="inner">
          <label for="subscribed" class="toggle-label semi-transparent">
            Automatically send a custom message for new followers
          </label>
          <label class="toggle-element">
            <input
              type="checkbox"
              id="subscribed"
              :checked="data.followers.enabled"
              v-model="data.followers.enabled"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div class="shadow-block section">
        <div class="container">
          <MessageInfo
            :type="'followers'"
            :info="data.followers"
            :settings="settings.followers"
            :dataChanged="isFollowersDataChanged"
            @save="save('followers')"
            @deleteImage="data.followers.image = null"
            @setImagePreview="path => (settings.followers.imagePreview = path)"
            @setImagePath="path => (settings.followers.imagePath = path)"
            class="existing-subscription"
          />
        </div>
        <button @click="togleMode('followers')" class="btn-address-edit">
          {{ settings.followers.isEditMode ? "Close" : "Edit" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MessageInfo from "./MessageInfo";
import Loader from "@/components/common/Loader";
// import mockData from "@/mock/welcomeMessages";

export default {
  name: "WelcomeMessageSettingsContent",
  components: {
    Loader,
    MessageInfo
  },
  data() {
    return {
      data: null,
      dataSnapshot: null,
      loading: false,
      settings: {
        subscribers: {
          isEditMode: false,
          imagePreview: "",
          imagePath: "",
          isSaving: false
        },
        followers: {
          isEditMode: false,
          imagePreview: "",
          imagePath: "",
          isSaving: false
        }
      }
    };
  },
  computed: {
    isSubscribersDataChanged() {
      return (
        this.data.subscribers.text !== this.dataSnapshot.subscribers.text ||
        this.data.subscribers.delay !== this.dataSnapshot.subscribers.delay ||
        this.data.subscribers.price !== this.dataSnapshot.subscribers.price ||
        this.data.subscribers.image !== this.dataSnapshot.subscribers.image
      );
    },
    isFollowersDataChanged() {
      return (
        this.data.followers.text !== this.dataSnapshot.followers.text ||
        this.data.followers.delay !== this.dataSnapshot.followers.delay ||
        this.data.followers.price !== this.dataSnapshot.followers.price ||
        this.data.followers.image !== this.dataSnapshot.followers.image
      );
    }
  },
  watch: {
    "data.subscribers.enabled"(newValue, oldValue) {
      if (oldValue === undefined) {
        return;
      }
      this.save("subscribers");
    },
    "data.followers.enabled"(newValue, oldValue) {
      if (oldValue === undefined) {
        return;
      }
      this.save("followers");
    }
  },
  methods: {
    init() {
      this.loading = true;
      this.$store.dispatch("welcomeMessages/fetch").then(res => {
        this.data = JSON.parse(JSON.stringify(res));
        this.dataSnapshot = JSON.parse(JSON.stringify(res));
        this.loading = false;
      });
    },
    _save(data, fieldName) {
      this.$store
        .dispatch("welcomeMessages/save", data, {
          root: true
        })
        .then(res => {
          this.data = JSON.parse(JSON.stringify(res));
          this.dataSnapshot = JSON.parse(JSON.stringify(res));
          this.settings[fieldName] = {
            isEditMode: false,
            imagePreview: "",
            imagePath: "",
            isSaving: false
          };
          this.$store.dispatch(
            "global/flashToast",
            { text: "Welcome messages settings updated" },
            { root: true }
          );
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.settings[fieldName].isSaving = false;
        });
    },
    save(fieldName) {
      const data = {
        ...this.dataSnapshot,
        [fieldName]: { ...this.data[fieldName] }
      };
      if (this.settings[fieldName].imagePath) {
        data[fieldName].newImage = this.settings[fieldName].imagePath;
      }
      if (!this.data[fieldName].image && !this.settings[fieldName].imagePath) {
        data[fieldName].image = "";
      }
      this.settings[fieldName].isSaving = true;
      this._save(data, fieldName);
    },
    togleMode(fieldName) {
      if (this.settings[fieldName].isEditMode) {
        this.resetFieldData(fieldName);
      }
      this.settings[fieldName].isEditMode = !this.settings[fieldName]
        .isEditMode;
    },
    resetFieldData(fieldName) {
      this.data[fieldName] = { ...this.dataSnapshot[fieldName] };
      this.settings[fieldName].imagePreview = "";
      this.settings[fieldName].imagePath = "";
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.section {
  position: relative;
  .btn-address-edit {
    right: 30px;
  }
}
.container {
  padding-bottom: 20px;
}
.section {
  padding-top: 30px;
}
</style>
