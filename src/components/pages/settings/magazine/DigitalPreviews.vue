<template>
  <div class="container previews">
    <div class="loader-infinity" v-if="loading">
      <Loader :fullscreen="false" :inline="true" text="" :small="true" />
    </div>
    <div v-else>
      <div class="items">
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
      <button @click="showMore" v-if="moreExists" class="btn more">
        Show more
      </button>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  props: {
    locked: Boolean
  },
  data() {
    return {
      limit: 12
    };
  },
  components: {
    Loader
  },
  computed: {
    loading() {
      return this.$store.state.magazine.fetchMagazinesLoading;
    },
    _items() {
      let items = [...this.$store.state.magazine.fetchMagazinesResult];
      return items.filter(v => v.type !== "intimate");
    },
    items() {
      let items = this._items;
      const n = items.length % 4;
      for (let i = 0; i < n; i++) {
        items.push({ id: "dummy" + Math.random(0, 10000) });
      }
      return items.slice(0, this.limit);
    },
    moreExists() {
      return this._items.length >= this.limit;
    }
  },
  methods: {
    click() {
      if (this.locked) {
        this.$emit("subscribe");
      }
    },
    showMore() {
      if (this.moreExists) {
        this.limit += 12;
      }
    }
  },
  created() {
    this.$store.dispatch("magazine/fetchMagazines", {});
  }
};
</script>
