<template>
  <Modal :onClose="close">
    <div class="popup-container popup-contest-voting" slot="content">
      <div class="content" :class="{ 'content_column-mob': $mq === 'mobile' }">
        <h1 class="popup__header">Vote for {{ name }}</h1>
        <button
          type="button"
          class="close close_shift-t close_default icn-item icn-size_lg"
          @click="close"
        />
        <Voting @close="close" :props="props" />
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Voting from "./Voting";

export default {
  name: "ContestVotingModal",
  components: {
    Modal,
    Voting
  },
  computed: {
    props() {
      return this.$store.state.modal.contestVoting.data;
    },
    name() {
      return this.props.name;
    },
    contestId() {
      return this.props.contestId;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "contestVoting" });
    }
  }
};
</script>
