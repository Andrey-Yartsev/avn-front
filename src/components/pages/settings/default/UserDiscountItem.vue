<template>
  <div class="item">
    <div class="table__cell">
      <router-link :to="'/' + item.user.username" class="userview-block">
        <span
          class="avatar avatar_sm"
          :class="{ 'online-state': isOnline(item.user.id) }"
        >
          <span class="avatar__img">
            <img :src="item.user.avatar" v-if="item.user.avatar" />
          </span>
        </span>
        <div class="name">{{ item.user.name }}</div>
        <span class="user-login reset-ml">{{ item.user.username }}</span>
      </router-link>
    </div>
    <div
      class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
    >
      <input
        type="number"
        :disabled="item.isActive"
        :id="`discount_user_amount-${item.user.id}`"
        v-model="amountValue"
      />
    </div>
    <div
      class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
    >
      <select
        :disabled="item.isActive"
        :id="`discount_user_months-${item.user.id}`"
      >
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="6">6</option>
        <option value="12">12</option>
      </select>
    </div>
    <div
      class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
    >
      <label class="toggle-element">
        <input
          type="checkbox"
          name="toggleDiscount"
          :disabled="!canActivate"
          :checked="item.isActive"
          @change="$emit('togle', item)"
        />
        <span
          class="toggle-element_switcher"
          :class="{ disabled: !canActivate }"
        />
      </label>
    </div>
    <div
      class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
    >
      <button
        v-if="!item.isActive"
        type="button"
        class="btn-unblock"
        @click="$emit('remove', item.user.id)"
        v-tooltip="'Remove'"
      >
        <span class="icn-item icn-remove"></span>
      </button>
      <span class="expireTime" v-else-if="item.expiredDate">
        Expire {{ time(item.expiredDate) }}
      </span>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "UserDiscountItem",
  mixins: [User],
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amountValue: ""
    };
  },
  computed: {
    canActivate() {
      return !!this.amountValue;
    }
  },
  methods: {
    time(date) {
      return fromNow(date);
    },
    updateAmount(e) {
      this.amountValue = e.target.value;
    }
  },
  mounted() {
    this.amountValue = this.item.amount;
  }
};
</script>
