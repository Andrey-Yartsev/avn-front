<template>
  <div class="addChatMessage">
    <div class="addFileCollectionView"></div>
    <form class="chatForm" v-on:submit.stop.prevent="sendMessage">
      <label class="add-media-input btn-el">
        <input type="file" accept=".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi">
      </label>
      <button class="tips btn-el hidden"></button>
      <div class="field-text-message">
        <textarea
          v-model="message"
          class="text-media-container" rows="1" cols="60" placeholder="Message" maxlength="500"
          style="overflow: hidden; overflow-wrap: break-word; height: 30px;"></textarea>
        <div class="price-message-wrapper"><span class="price-message"></span>
          <button type="button" class="btn-clear-price"></button>
        </div>
      </div>
      <div class="chatTip hidden">
        <button class="cancel btn btn-cancel">Cancel</button>
        <div class="chatTip__field">
          <input
            type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" name="tipAmount" class="tipAmount"
            placeholder="Enter tip amount">
        </div>
        <button class="sendTip btn">Send tip</button>
      </div>
      <div class="getPaidForm hidden">
        <button class="cancelPaid btn btn-cancel">Cancel</button>
        <input type="hidden" name="priceAmount" class="getPaidAmount">
        <div class="getPaidForm__field">
          <input
            type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" class="getPaidAmountPlaceholder"
            placeholder="Enter price">
        </div>
        <button class="setPrice btn">Set Price</button>
      </div>
      <button class="getPaid btn-el hidden"></button>
      <!-- <label class="submit"><input type="submit" class="notVisible"/></label> -->
      <button type="submit" class="submit btn-el" :disabled="!message"></button>
    </form>
  </div>
</template>
<script>
export default {
  name: "ChatAddMessage",

  props: {
    withUser: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      message: ""
    };
  },

  methods: {
    sendMessage() {
      this.$store.dispatch("chat/sendMessage", {
        userId: this.withUser.id,
        message: this.message
      });
      this.message = "";
    }
  }
};
</script>
