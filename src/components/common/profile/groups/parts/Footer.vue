<template>
  <div class="actions">
    <span class=" actions__btn">
      <span
        class="btn-icon icn-tips icn-item icn-size_md"
        v-tooltip="'Price'"
      ></span>
      {{ group.price }}
    </span>
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
    <span class="actions__btn members" @click="showMembersModal">
      <span
        class="btn-icon icn-profile icn-item icn-size_md"
        v-tooltip="'Members'"
      ></span>
      {{ group.membersCount || 0 }}
    </span>
    <span class="actions__btn members" @click="showMessageModal">
      <span
        class="btn-icon icn-message icn-item icn-size_md"
        v-tooltip="'Group message'"
      ></span>
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
  methods: {
    deleteGroup() {
      this.$store.dispatch("profile/groups/deleteGroup", this.group.productId);
    },
    showMembersModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMembers",
        data: {
          group: this.group
        }
      });
    },
    showMessageModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMembersMessage",
        data: {
          group: this.group
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  align-items: center;

  &__btn {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
}
.delete-card {
  margin-left: auto;
}
.members {
  cursor: pointer;
}
</style>
