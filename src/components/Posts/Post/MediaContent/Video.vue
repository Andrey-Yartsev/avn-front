<template>
<video disableremoteplayback webkit-playsinline playsinline controls poster="<%=media[i].preview%>">
    <%for(var type in media[i].video){%>
    <source v-for="type in video" src="type>" type="video/<%=type%>">
    <%}%>
</video>
</template>

<script>
export default {
  name: "LockedPicture",
  props: {
    base64: {
      type: String,
      required: true
    }
  },
  computed: {
    image() {
      return `data:image/jpeg;base64,${this.base64}`;
    }
  }
};
</script>
