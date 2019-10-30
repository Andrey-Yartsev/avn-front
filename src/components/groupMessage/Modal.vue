<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div>
            <div class="popup-addPost__header hidden-mobile">
              <div class="header__title">
                Send message to {{ subscriberType }} subscribers
              </div>
              <div class="form-group form-group_with-label gender-options">
                <label class="form-group-inner">
                  <span class="label">Choose group</span>
                  <div class="row">
                    <div class="col-1-2">
                      <div class="select-wrapper">
                        <select
                          v-model="subscriberType"
                          name="subscriberType"
                          class="default-disabled"
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              <button
                type="button"
                class="close close_shift-t close_default icn-item icn-size_lg"
                @click="close"
              />
            </div>
            <AddMessageBox
              @send="submit"
              :withUser="user"
              :withFontSizeController="false"
              :withTips="false"
            />
          </div>
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
        console.log(err);
      } finally {
        this.$store.dispatch("modal/hide", { name: "groupMessage" });
      }
    }
  }
};
</script>
