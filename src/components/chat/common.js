export default {
  computed: {
    chats() {
      let chats = this.$store.state.chat.chats.map(v => {
        const copy = { ...v };
        if (copy.lastMessage) {
          if (Object.keys(copy.lastMessage).length === 0) {
            copy.lastMessage = null;
          }
        }
        if (this.activeUserId === copy.id) {
          copy.active = true;
        }
        return copy;
      });
      if (this.virtualChat) {
        if (chats.find(v => v.withUser.id === this.virtualChat.withUser.id)) {
          return chats;
        }
        let virtualChat = Object.assign({}, this.virtualChat);
        virtualChat.active = !this.activeChat;
        chats.push(virtualChat);
      }
      chats = chats.sort((a, b) => {
        let d1, d2;
        if (a.lastMessage) {
          d1 = new Date(a.lastMessage.createdAt);
        } else if (a.createdAt) {
          d1 = a.createdAt;
        }
        if (b.lastMessage) {
          d2 = new Date(b.lastMessage.createdAt);
        } else if (b.createdAt) {
          d2 = b.createdAt;
        }
        if (!d1 || !d2) {
          return -1;
        }
        return d2 - d1;
      });
      return chats;
    }
  }
};
