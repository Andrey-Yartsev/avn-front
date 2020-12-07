<template>
  <div class="addPost truncated">
    <div class="addPost-header" v-if="$mq === 'mobile'">
      <button
        @click="closeHandler"
        type="button"
        class="header-return-btn go-back go-back_times"
      >
        <h1 class="category-name">
          {{ this.isNew ? "New Link" : "Edit Link" }}
        </h1>
      </button>
    </div>
    <form
      @submit.prevent="submitHandler"
      class="add-new-form expanded links-editor"
      :class="{
        'bg-gradient_light': $mq === 'desktop',
        container: $mq === 'mobile'
      }"
    >
      <div class="links-editor__body">
        <div
          class="form-group"
          :class="{ 'form-group_row-md': $mq === 'desktop' }"
        >
          <label class="form-group-inner">
            <span class="label">Link url</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <input
                  type="text"
                  v-model.trim="url"
                  name="url"
                  :class="{ 'text-field-border': $mq === 'desktop' }"
                />
              </span>
              <div class="url-route">
                <span
                  class="url-route__item"
                  :class="{ selected: url && isWebLink }"
                >
                  <span class="icn-web icn-item" />
                  Web URL
                </span>
                <span
                  class="url-route__item"
                  :class="{ selected: url && !isWebLink }"
                >
                  <span class="icn-snapchat icn-item" />
                  Snapchat
                </span>
                <span
                  class="url-route__item"
                  :class="{ selected: url && !isWebLink }"
                >
                  <span class="icn-other icn-item" />
                  Other
                </span>
              </div>
            </span>
          </label>
        </div>
        <div
          class="form-group"
          :class="{ 'form-group_row-md': $mq === 'desktop' }"
        >
          <label class="form-group-inner">
            <span class="label">Link title</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <input
                  type="text"
                  v-model.trim="title"
                  name="title"
                  required
                  :class="{ 'text-field-border': $mq === 'desktop' }"
                />
              </span>
            </span>
          </label>
        </div>
      </div>
      <div class="links-editor__footer">
        <label for="pinLink" class="btn-pin">
          <input type="checkbox" v-model="pinned" id="pinLink" />
          <span class="icn-pin icn-item icn-size_md"></span>
          <span class="btn-pin__text">
            {{ pinned ? "Unpin link" : "Pin link" }}
          </span>
        </label>

        <div class="links-editor__controls">
          <button
            class="btn delicate-light"
            @click="closeHandler"
            v-if="$mq === 'desktop'"
          >
            Cancel
          </button>
          <button
            type="text"
            v-if="isEditMode"
            class="btn delicate-dark"
            @click.prevent="deleteHandler"
          >
            Delete link
          </button>
          <button class="btn" type="submit" :disabled="isDisabled">
            {{ isEditMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["close"],
  data() {
    return {
      url: "",
      title: "",
      pinned: false
    };
  },
  computed: {
    isDisabled() {
      return !this.url || !this.title;
    },
    isWebLink() {
      return this.isStringMatch(this.url);
    },
    isEditMode() {
      return !!this.$store.state.profile.links.editedLink;
    }
  },
  methods: {
    isStringMatch(str) {
      return str.indexOf("http") !== -1;
    },
    submitHandler(e) {
      const newLink = {
        url: this.url,
        title: this.title,
        pinned: this.pinned
      };
      if (this.isEditMode) {
        newLink.id = this.id;
      }
      this.$emit("submit", { data: newLink, editMode: this.isEditMode });
      this.closeHandler(e);
    },
    deleteHandler() {
      this.$store.dispatch("profile/links/deleteLink", this.id);
      this.clear();
      this.$store.dispatch("modal/hide", {
        name: "addLink"
      });
    },
    clear() {
      this.url = "";
      this.title = "";
    },
    closeHandler(e) {
      this.clear();
      this.close(e);
    },
    seedForm() {
      this.url = this.$store.state.profile.links.editedLink.url;
      this.title = this.$store.state.profile.links.editedLink.title;
      this.pinned = this.$store.state.profile.links.editedLink.pinned;
      this.id = this.$store.state.profile.links.editedLink.id;
    }
  },
  mounted() {
    if (this.$store.state.profile.links.editedLink) {
      this.seedForm();
    }
  }
};
</script>
