<template>
  <Modal>
    <AddPost/>
  </Modal>
</template>

<script>
import Modal from "@/modal/Index";
import AddPost from "@/addPost/Index";

export default {
  name: "AddPostModal",

  components: {
    Modal,
    AddPost
  }
};
</script>
