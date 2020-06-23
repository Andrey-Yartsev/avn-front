<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container popup-addPost">
        <div class="content content_relative">
          <div
            class="popup-addPost__header hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            Edit group
            <button
              type="button"
              class="close close_shift-t close_default icn-item icn-size_lg"
              @click.prevent="close"
            />
          </div>
          <EditGroup
            :initialExpanded="true"
            :close="close"
            :data="group"
            type="edit"
            where="modal"
            ref="editGroup"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import EditGroup from "../edit/Index";

// const InitData = {
//   productId: null,
//   title: "",
//   description: "",
//   media: [],
//   price: "",
//   isActive: false,
//   isPublic: false
// };

export default {
  name: "EditGroupModal",
  components: {
    Modal,
    EditGroup
  },
  // data() {
  //   return {
  //     group: { ...InitData }
  //   };
  // },
  computed: {
    group() {
      return this.$store.state.modal.editGroup.data.group;
    }
  },
  methods: {
    // init() {},
    // clear() {
    //   this.group = { ...InitData };
    // },
    close() {
      if (this.$refs.editGroup.uploadInProgress) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title: "Upload in progress",
            success: () => {
              this.$store.dispatch("modal/hide", { name: "editGroup" });
            }
          }
        });
        return;
      }
      this.$store.dispatch("modal/hide", { name: "editGroup" });
    }
  }
  // mounted() {
  //   this.init();
  //   console.log("mounted");
  // },
  // beforeDestroy() {
  //   this.clear();
  //   console.log("before destroy");
  // }
};
</script>
