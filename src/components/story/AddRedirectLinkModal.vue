<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-container_hfluid highlights-popup">
        <div class="content">
          <div class="container-popup">
            <div class="popup-title popup-title_sticky-mob">
              <button
                class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
                @click="close"
                v-if="$mq === 'mobile'"
              />
              <div class="page-title page-title_reset-gl">
                Add redirect link
              </div>
            </div>
            <div class="popup-body">
              <div class="addPost truncated">
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
                        <span class="label">Title</span>
                        <span class="form-group form-group_clear-gaps">
                          <span class="form-field">
                            <input
                              type="text"
                              v-model.trim="linkTitle"
                              name="title"
                              required
                              :class="{
                                'text-field-border': $mq === 'desktop'
                              }"
                            />
                          </span>
                        </span>
                      </label>
                    </div>
                    <div
                      class="form-group"
                      :class="{ 'form-group_row-md': $mq === 'desktop' }"
                    >
                      <label class="form-group-inner">
                        <span class="label">Link Url</span>
                        <span class="form-group form-group_clear-gaps">
                          <span class="form-field">
                            <input
                              type="text"
                              v-model.trim="linkUrl"
                              name="url"
                              :class="{
                                'text-field-border': $mq === 'desktop'
                              }"
                            />
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div class="links-editor__footer">
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
                        v-if="isLinkExists"
                        class="btn delicate-dark"
                        @click.prevent="deleteHandler"
                      >
                        Delete link
                      </button>
                      <button class="btn" type="submit" :disabled="isDisabled">
                        {{ isLinkExists ? "Update" : "Add" }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="close close_shift-t close_shift-r close_default icn-item icn-size_lg"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";

export default {
  name: "AddRedirectLinkModal",
  mixins: [User],
  components: {
    Modal,
    Loader
  },
  data() {
    return {
      linkTitle: "",
      linkUrl: ""
    };
  },
  computed: {
    storyId() {
      return this.$store.state.modal.addRedirectLink.data.storyId;
    },
    isLinkExists() {
      return !!(
        this.$store.state.modal.addRedirectLink.data.linkUrl &&
        this.$store.state.modal.addRedirectLink.data.linkTitle
      );
    },
    isDisabled() {
      return !this.linkTitle || !this.linkUrl;
    }
  },
  methods: {
    submitHandler() {
      this.$store
        .dispatch(
          "stories/addRedirectLink",
          {
            linkUrl: this.linkUrl,
            linkTitle: this.linkTitle,
            storyId: this.storyId
          },
          { root: true }
        )
        .then(() => {
          this.$store.dispatch(
            "global/flashToast",
            { text: "Link added to story" },
            {
              root: true
            }
          );
          this.close();
        });
    },
    deleteHandler() {
      this.$store
        .dispatch(
          "stories/addRedirectLink",
          {
            linkUrl: "",
            linkTitle: "",
            storyId: this.storyId
          },
          { root: true }
        )
        .then(() => {
          this.clear();
          this.$store.dispatch(
            "global/flashToast",
            { text: "Link has deleted" },
            {
              root: true
            }
          );
          this.close();
        });
    },
    closeHandler() {
      this.clear();
      this.close();
    },
    clear() {
      this.linkUrl = "";
      this.linkTitle = "";
    },
    close() {
      this.$store.state.modal.addRedirectLink.data.cb();
      this.$store.dispatch("modal/hide", { name: "addRedirectLink" });
    },
    seedForm() {
      this.linkUrl = this.$store.state.modal.addRedirectLink.data.linkUrl || "";
      this.linkTitle =
        this.$store.state.modal.addRedirectLink.data.linkTitle || "";
    }
  },
  created() {
    this.seedForm();
  }
};
</script>

<style lang="scss" scoped>
.links-editor__footer {
  justify-content: flex-end;
}
</style>
