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
        <div v-if="isAuthor" class="header-content-settings">
          <Footer :group="group" />
        </div>
        <div v-else class="header-content-joinGroupContainer">
          <button
            v-if="group.isMember"
            @click="joinGroup"
            type="button"
            class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter"
          >
            Join for ${{ group.price }}
          </button>
          <button
            v-else
            @click="leaveGroup"
            type="button"
            class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter"
          >
            Leave the group
          </button>
        </div>
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
    isAuthor() {
      // return false;
      return this.user.id === this.profile.id;
    }
  },
  methods: {
    joinGroup() {
      this.$store.dispatch("modal/show", {
        name: "groupPayConfirm",
        data: {
          price: this.group.price,
          productId: this.group.productId
        }
      });
    },
    leaveGroup() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Leave the current group",
          success: () => {
            this.$store.dispatch(
              "profile/groups/leaveGroup",
              this.group.productId
            );
          }
        }
      });
    }
  }
};
</script>
