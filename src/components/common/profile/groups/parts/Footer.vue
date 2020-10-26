<template>
  <div class="actions">
    <span class="actions__btn">
      <span
        :class="{
          'icn-unlocked': group.isPublic,
          'icn-locked': !group.isPublic
        }"
        class="btn-icon  icn-item icn-size_md"
        v-tooltip="'Privacy'"
      ></span>
      {{ group.isPublic ? "Public" : "Private" }}
    </span>
    <span v-if="showPrice" class="actions__btn">
      <span
        class="btn-icon icn-tips icn-item icn-size_md"
        v-tooltip="'Price'"
      ></span>
      {{ group.price }}
    </span>
    <span class="actions__btn">
      <span
        :class="{
          'icn-radio-checked': group.isActive,
          'icn-radio-unchecked': !group.isActive
        }"
        class="btn-icon icn-item icn-size_md"
        v-tooltip="'Status'"
      ></span>
      {{ group.isActive ? "Active" : "Draft" }}
    </span>
    <span
      class="actions__btn hover-highlight members"
      @click="showMembersModal"
    >
      <span
        class="btn-icon icn-profile icn-item icn-size_md"
        v-tooltip="'Members'"
      ></span>
      {{ group.membersCount || 0 }}
    </span>
    <span
      v-if="group.membersCount > 0 && group.isActive"
      class="actions__btn  hover-highlight message"
      @click="showMassMessageModal"
    >
      <span
        class="btn-icon  icn-item icn-size_md icn-coments"
        v-tooltip="'Group message'"
      ></span>
      Message
    </span>
    <span
      class="actions__btn  hover-highlight welcome"
      @click="showWelcomeMessageModal"
    >
      <span
        class="btn-icon icn-item icn-size_md icn-message"
        v-tooltip="'Welcome message'"
      ></span>
      Welcome message
    </span>
    <button class="delete-card icn-item" @click="deleteGroup">
      <span class="actions__btn">
        <span class="icn-remove icn-item" v-tooltip="'Delete'" />
      </span>
    </button>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";

export default {
  name: "Footer",
  mixins: [userMixin],
  data: () => ({
    opened: false
  }),
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  computed: {
    showPrice() {
      return parseFloat(this.group.price) > 0;
    }
  },
  methods: {
    deleteGroup() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: `Delete group ${this.group.title}`,
          success: () => {
            this.$store.dispatch(
              "profile/groups/deleteGroup",
              this.group.productId
            );
          }
        }
      });
    },
    showMembersModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMembers",
        data: {
          group: this.group,
          isOwnerView: true
        }
      });
    },
    showMassMessageModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMembersMessage",
        data: {
          group: this.group
        }
      });
    },
    showWelcomeMessageModal() {
      this.$store.dispatch("modal/show", {
        name: "groupWelcomeMessage",
        data: {
          group: this.group
        }
      });
    }
  }
};
</script>
