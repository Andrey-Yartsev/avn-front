<template>
  <div class="groupItem">
    <div class="groupItem-header">
      <img
        :src="group.media[0].src.source"
        :alt="group.title"
        class="header-image"
      />
      <div class="header-content bg-gradient bg-gradient_light">
        <h3 v-html="group.title" />
        <div class="header-content-description" v-html="group.description" />
        <div class="header-content-media" v-if="showFreeAccessMedia">
          <h4 class="title">Free Access</h4>
          <div class="header-content-media-list">
            <router-link
              v-for="item in group.freeAccessMedia"
              :key="item.id"
              :to="getLinkUrl(item.id)"
              class="header-content-media-list-item"
            >
              <img :src="item.image" class="media-preview-image" />
              <span class="media-preview-title">{{ item.title }}</span>
            </router-link>
          </div>
        </div>
        <div v-if="isOwner(profile.id)" class="header-content-settings">
          <Footer :group="group" />
          <div class="header-content-editButton" @click="openEditModal">
            Edit
          </div>
        </div>
        <template v-else>
          <div
            v-if="group.isMember"
            class="header-content-groupMemberContainer"
          >
            <button
              v-if="showUpgradeButton"
              @click="sendFee"
              type="button"
              class="btn alt border"
            >
              Tip $ to Upgrade Level
            </button>
            <button
              v-if="group.membersViewAmount !== 'none'"
              @click="showMembers"
              type="button"
              class="btn alt border"
            >
              Leaderboard
            </button>
            <button
              v-if="group.isMember"
              @click="leaveGroup"
              type="button"
              class="btn alt border"
            >
              Leave the group
            </button>
          </div>
          <div v-else class="header-content-groupMemberContainer">
            <button
              v-if="group.canRenew"
              @click="joinGroup({ renew: true })"
              type="button"
              class="btn"
            >
              Renew for free
            </button>
            <button
              v-else
              @click="joinGroup({ renew: false })"
              type="button"
              class="btn"
            >
              Join the group
            </button>
            <button
              v-if="group.membersViewAmount !== 'none'"
              @click="showMembers"
              type="button"
              class="btn alt border"
            >
              Leaderboard
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import Footer from "../parts/Footer";

export default {
  name: "GroupItem",
  mixins: [User],
  components: {
    Footer
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    isPrivate: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    profile() {
      return this.$store.state.profile.home.profile;
    },
    showUpgradeButton() {
      return parseFloat(this.group.price) > 0;
    },
    showFreeAccessMedia() {
      return (
        this.group.freeAccessMedia?.length &&
        (this.isOwner(this.profile.id) || this.group.isMember)
      );
    }
  },
  methods: {
    joinGroup({ renew }) {
      if (!this.$store.state.auth.user) {
        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            callback: () => {}
          }
        });
        return;
      }
      if (
        this.group.forSubscribersOnly &&
        !this.profile.subscribedBy &&
        !renew
      ) {
        this.$store.dispatch("global/flashToast", {
          text: "This group is available for subscribers only",
          type: "warning"
        });
      } else {
        this.openJoinGroupModal(renew);
      }
    },
    openJoinGroupModal(renew) {
      this.$store.dispatch("modal/show", {
        name: "groupPayConfirm",
        data: {
          price: this.group.price,
          productId: this.group.productId,
          join: true,
          renew,
          showMembers: this.group.membersViewAmount !== "none"
        }
      });
    },
    leaveGroup() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Leave the current group",
          success: () => {
            this.$store
              .dispatch("profile/groups/leaveGroup", this.group.productId)
              .then(() => {
                this.$store.dispatch("global/flashToast", {
                  text: "You have left the group"
                });
              });
          }
        }
      });
    },
    sendFee() {
      this.$store.dispatch("modal/show", {
        name: "groupPayConfirm",
        data: {
          price: this.group.price,
          productId: this.group.productId,
          join: false,
          showMembers: this.group.membersViewAmount !== "none"
        }
      });
    },
    showMembers() {
      this.$store.dispatch("modal/show", {
        name: "groupMembers",
        data: {
          group: this.group,
          isOwnerView: false
        }
      });
    },
    openEditModal() {
      this.$store.dispatch("modal/show", {
        name: "editGroup",
        data: {
          group: this.group
        }
      });
    },
    getLinkUrl(id) {
      return `/media/${this.profile.username}/${id}`;
    }
  }
};
</script>
