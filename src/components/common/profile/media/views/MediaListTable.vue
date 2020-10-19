<template>
  <div class="MediaListTableView settings-wrapper">
    <div
      class="form-title"
      :class="{
        'table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo':
          $mq === 'desktop'
      }"
    >
      <div class="table-header">
        <div class="thumb table__cell" @click="filterClick('title')">
          Thumb/Title
        </div>
        <div
          class="price table__cell table__cell_align table__cell_align-hor-c"
          @click="filterClick('price')"
        >
          Price
        </div>
        <div
          class="status table__cell table__cell_align table__cell_align-hor-c"
          @click="filterClick('status')"
        >
          Status
        </div>
        <div
          class="date table__cell table__cell_align table__cell_align-hor-c"
          @click="filterClick('date')"
        >
          Publish<br />
          date
        </div>
        <div
          class="monthRevenue table__cell table__cell_align table__cell_align-hor-c"
          @click="filterClick('monthRevenue')"
        >
          Month<br />
          revenue
        </div>
        <div
          class="totalRevenue table__cell table__cell_align table__cell_align-hor-c"
          @click="filterClick('totalRevenue')"
        >
          Total<br />
          revenue
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="table-wrapper">
        <div class="table payouts-table">
          <MediaListTableItem
            v-for="item in items"
            :key="item.id"
            :media="item"
            @filterClickHandler="filterClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toHumanDuration } from "@/helpers/datetime";
import Loader from "@/components/common/Loader";
import MediaListTableItem from "./MediaListTableItem";

export default {
  name: "MediaListItemView",
  components: {
    Loader,
    MediaListTableItem
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    actionPrefix() {
      return this.from;
    },
    media() {
      return this.$props.post.media;
    },
    mediaDuration() {
      return this.media.duration ? toHumanDuration(this.media.duration) : "";
    },
    page() {
      return this.$route.meta.page;
    },
    getVideoResolution() {
      if (
        !this.$props.post.media.src.width ||
        !this.$props.post.media.src.height
      ) {
        return "";
      }
      return (
        Math.min(
          this.$props.post.media.src.height,
          this.$props.post.media.src.width
        ) + "p"
      );
    },
    isFreeClip() {
      if (this.post.price === 0) {
        return true;
      }
      return false;
    }
  },
  methods: {
    openModal() {
      if (!this.user && !this.isFreeClip) {
        this.$store.dispatch("modal/show", {
          name: "signup"
        });
        return;
      }
      if (this.shouldBePoster) {
        this.$router.push(
          `/explore/videos#m/media/${this.post.productId}/${this.from}`
        );
        return;
      }
      this.goToModalRoute(`media/${this.post.productId}/${this.from}`);
    },
    getVideoDuration(duration) {
      const mins = Math.floor(+duration / 60);
      const sec = +duration - mins * 60;
      return `${mins < 10 ? "0" : ""}${mins} : ${sec < 10 ? "0" : ""}${sec}`;
    },
    filterClick(type) {
      this.$emit("filterClickHandler", type);
    }
  }
};
</script>
