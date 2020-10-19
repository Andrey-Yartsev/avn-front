<template>
  <div class="item">
    <div class="thumb table__cell">
      <a href="#" @click.prevent="openModal" class="userview-block">
        <span class="avatar avatar_lg">
          <span class="avatar__img">
            <img
              :src="
                media.media.type === 'audio'
                  ? '/static/img/volume.svg'
                  : media.media.thumb.source
              "
            />
          </span>
        </span>
        <div class="name">{{ media.title }}</div>
        <span
          v-if="media.pinned"
          class="pinnedIcon icn-item icn-pin icn-size-sm"
        />
      </a>
    </div>
    <div
      class="price table__cell table__cell_align table__cell_align-hor-c"
      data-title="Price"
      @click="filterClick('price')"
    >
      ${{ media.price }}
    </div>
    <div
      class="status table__cell table__cell_align table__cell_align-hor-c"
      data-title="Status"
      @click="filterClick('status')"
    >
      {{ media.active ? "On sale" : "Draft" }}
    </div>
    <div
      class="date table__cell table__cell_align table__cell_align-hor-c"
      data-title="Date"
      @click="filterClick('date')"
    >
      {{ media.active ? messageTime(media.publishDate) : "" }}
    </div>
    <div
      class="monthRevenue table__cell table__cell_align table__cell_align-hor-c"
      data-title="Month revenue"
      @click="filterClick('monthRevenue')"
    >
      ${{ media.monthRevenue || 0 }}
    </div>
    <div
      class="totalRevenue table__cell table__cell_align table__cell_align-hor-c"
      data-title="Total revenue"
      @click="filterClick('totalRevenue')"
    >
      ${{ media.totalRevenue || 0 }}
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import truncate from "truncate-html";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "MediaListTableItem",
  mixins: [User, ModalRouterGoto],
  data: function() {
    return {
      showDropdown: false
    };
  },
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  computed: {},
  methods: {
    truncate(v) {
      return truncate(v, 150);
    },
    messageTime(message) {
      const expiredDate = fromNow(message);
      if (expiredDate === "in a month") {
        return "n/a";
      }
      return expiredDate;
    },
    openModal() {
      this.goToModalRoute(`media/${this.media.productId}/profile/home`);
    },
    trimmText(text, len) {
      if (!text.length) {
        return "";
      }
      if (text.length > len) {
        return text.slice(0, len - 3) + "...";
      }
      return text;
    },
    filterClick(type) {
      if (this.$mq === "desktop") {
        return;
      }
      this.$emit("filterClickHandler", type);
    }
  }
};
</script>
