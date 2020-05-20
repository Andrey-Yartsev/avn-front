<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-massmes">
        <div class="content content_relative">
          <div class="popup__header m-underline-border">
            Send message to {{ subscriberType }} subscribers
          </div>
          <div class="popup__content">
            <div class="form-group form-group_clear-gaps">
              <label class="form-group-inner">
                <span class="label">Choose group</span>
                <div class="row">
                  <div
                    :class="{
                      'col-3-4': $mq === 'mobile',
                      'col-1-2': $mq === 'desktop'
                    }"
                  >
                    <div class="select-wrapper">
                      <select
                        v-model="subscriberType"
                        name="subscriberType"
                        class="default-disabled"
                      >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <AddMessageBox
            @send="submit"
            :withUser="user"
            :withFontSizeController="false"
            :withTips="false"
            :multipleMedia="true"
          />
          <button
            type="button"
            class="close close_shift-t close_default icn-item icn-size_lg close_visible-mob"
            @click="close"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import AddMessageBox from "@/components/chat/AddMessageBox";

export default {
  name: "groupMessageModal",
  components: {
    Modal,
    AddMessageBox
  },
  data() {
    return {
      subscriberType: "all"
    };
  },
  computed: {
    title() {
      return !!this.$store.state.profile.links.editedLink;
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "groupMessage" });
      this.$store.commit("profile/links/endEditLink");
    },
    async submit(data) {
      const body = {
        ...data,
        recipients: this.subscriberType
      };
      try {
        await this.$store.dispatch("chat/sendGroupMessage", body);
        this.$store.commit("global/toastShowTrigger", {
          text: "Group message has sent",
          type: "success"
        });
      } catch (err) {
        this.$store.commit("global/toastShowTrigger", {
          text: err.message,
          type: "warning"
        });
      } finally {
        this.$store.dispatch("modal/hide", { name: "groupMessage" });
      }
    }
  }
};
</script>
