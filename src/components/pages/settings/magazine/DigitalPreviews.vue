<template>
  <div class="container previews">
    <div class="loader-infinity" v-if="loading">
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </div>
    <div class="items" v-else>
      <div class="item" v-for="v in items" :key="v.id">
        <a
          v-if="!locked"
          :href="v.pdfLink"
          target="_blank"
          :class="{ 'locked-picture icn-pos_center icn-item': locked }"
        >
          <img :src="v.imageUrl" v-if="v.imageUrl" />
        </a>
        <a
          v-else
          target="_blank"
          :class="{ 'locked-picture icn-pos_center icn-item': locked }"
          @click="click"
        >
          <img :src="v.imageUrl" v-if="v.imageUrl" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  props: {
    locked: Boolean
  },
  components: {
    Loader
  },
  computed: {
    loading() {
      return this.$store.state.magazine.fetchMagazinesLoading;
    },
    items() {
      const items = [...this.$store.state.magazine.fetchMagazinesResult];
      const n = items.length % 4;
      for (let i = 0; i < n; i++) {
        items.push({ id: "dummy" + i });
      }
      return items;
    }
  },
  methods: {
    click() {
      if (this.locked) {
        this.$emit("subscribe");
      }
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchMagazines");
  }
};
</script>
