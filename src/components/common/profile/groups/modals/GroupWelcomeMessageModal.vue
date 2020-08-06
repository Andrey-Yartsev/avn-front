<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-massmes SubscribersGroupMessages">
        <div class="content content_relative">
          <div class="popup__header">
            Welcome message for new group members
          </div>
          <div class="loader-container loader-container_center" v-if="loading">
            <Loader :fullscreen="false" :small="true" :semilight="true" />
          </div>
          <div class="border-top bg-gradient_light">
            <AddMessageBox
              @send="submit"
              :withUser="user"
              :withFontSizeController="false"
              :withTips="false"
              :multipleMedia="true"
              :initData="welcomeMessageData"
              :sendButtonTooltip="'Save'"
            />
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg close_visible-mob"
              @click.prevent="close"
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
import Loader from "@/components/common/Loader";

export default {
  name: "GroupWelcomeMessage",
  components: {
    Modal,
    AddMessageBox,
    Loader
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.groupWelcomeMessage.data;
    },
    group() {
      return this.data.group;
    },
    user() {
      return this.$store.state.auth.user;
    },
    welcomeMessageData() {
      return this.group.welcomeMessage || null;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "groupWelcomeMessage" });
    },
    async submit(data) {
      const body = {
        ...this.group,
        mediaFiles: this.group.media.map(item => ({ id: item.id })),
        members: this.group.members.map(item => item.id),
        welcomeMessage: {
          ...data,
          mediaFiles: data.mediaFile || []
        }
      };
      delete body.welcomeMessage.mediaFile;
      delete body.media;
      delete body.canRenew;
      delete body.membersCount;
      try {
        this.loading = true;
        await this.$store.dispatch("profile/groups/updateGroup", body);
        this.$store.commit("global/toastShowTrigger", {
          text: "Group welcome message updated",
          type: "success"
        });
      } catch (err) {
        this.$store.commit("global/toastShowTrigger", {
          text: err.message,
          type: "warning"
        });
      } finally {
        this.loading = false;
        this.$store.dispatch("modal/hide", { name: "groupWelcomeMessage" });
      }
    }
  }
};
</script>
