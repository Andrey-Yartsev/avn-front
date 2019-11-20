<template>
  <div v-if="visibleEvents.length">
    <div class="likesContainer">
      <div v-for="(like, i) in likes" :key="i" class="like">
        <div class="like-icon">
          <div class="like-icon__symbol icn-item" />
        </div>
      </div>
    </div>
    <perfect-scrollbar id="scroll" class="comments-list-scrolling">
      <Item v-for="(v, i) in visibleEvents" :key="i" :item="v" />
    </perfect-scrollbar>
  </div>
</template>

<script>
import Item from "./Item";
// import takeRight from "lodash.takeright";

export default {
  name: "StreamComments",
  components: {
    Item
  },
  data() {
    return {
      currentTime: 0
    };
  },
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  computed: {
    visibleEvents() {
      const events = this.events.filter(v => {
        if (v.type !== "comment" && v.type !== "join") {
          return false;
        }
        return v.time < this.currentTime;
      });
      return events.slice(0, 5);
    },
    likes() {
      return this.events.filter(v => {
        if (v.type !== "like") {
          return false;
        }
        return v.time < this.currentTime;
      });
    }
  }
};
</script>
