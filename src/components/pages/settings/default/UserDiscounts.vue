<template>
  <div class="DiscountUsersCollectionView">
    <div
      class="form-title border-top table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
      :class="{ 'm-search-results': showSearchResult }"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner m-wrap-elements m-separate-rows-mob">
          <span class="semi-transparent">
            {{ title }}
            <p class="subtext">
              {{ subtext }}
            </p>
          </span>
          <form class="blocked-search b-search-form">
            <SearchBubble
              @addUser="addUser"
              @togleSearchResult="togleSearchResult"
              :placeholder="'Search to add user'"
            />
          </form>
        </div>
        <div class="table-header blocked-table-header ">
          <div class="user table__cell">
            User
          </div>
          <div class="date table__cell table__cell_align-hor-c actions">
            %
          </div>
          <div class="date table__cell table__cell_align-hor-c actions">
            Months
          </div>
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
          >
            Status
          </div>
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
          ></div>
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="table-wrapper">
        <div class="table blocked-table" v-if="users.length">
          <div class="item" v-for="user in users" :key="user.id">
            <div class="table__cell">
              <router-link :to="'/' + user.username" class="userview-block">
                <span
                  class="avatar avatar_sm"
                  :class="{ 'online-state': isOnline(user.id) }"
                >
                  <span class="avatar__img">
                    <img :src="user.avatar" v-if="user.avatar" />
                  </span>
                </span>
                <div class="name">{{ user.name }}</div>
                <span class="user-login reset-ml">{{ user.username }}</span>
              </router-link>
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
            >
              <input
                type="number"
                :value="user.amount"
                :disabled="user.isActive"
                :id="`discount_user_amount-${user.id}`"
              />
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
            >
              <select
                :disabled="user.isActive"
                :id="`discount_user_months-${user.id}`"
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
                  :checked="user.isActive"
                  @change="togle(user)"
                />
                <span class="toggle-element_switcher" />
              </label>
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
            >
              <button
                v-if="!user.isActive"
                type="button"
                class="btn-unblock"
                @click="remove(user.id)"
                v-tooltip="'Remove'"
              >
                <span class="icn-item icn-remove"></span>
              </button>
              <span v-else-if="user.expiredDate">
                Expire {{ time(user.expiredDate) }}
              </span>
            </div>
          </div>
        </div>
        <div class="empty-table-info show shadow-block" v-else>
          <span>No one get discount yet</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import SearchBubble from "@/components/common/profile/media/parts/searchUsers/Index";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "UserDiscounts",
  mixins: [User],
  components: {
    SearchBubble
  },
  props: {
    title: {
      type: String,
      default: "Personal discounts"
    },
    // mobileBlockedRoute: {
    //   type: String,
    //   default: true
    // },
    source: {
      type: String,
      default: "users"
    },
    subtext: {
      type: String,
      default: "Personalized subscription discounts"
    }
  },

  data() {
    return {
      query: "",
      showSearchResult: false
    };
  },

  computed: {
    users() {
      return this.$store.state.subscription.discounts.users;
    }
  },

  methods: {
    init() {
      this.$store.dispatch("subscription/discounts/fetchDiscounts");
    },
    add(user) {
      this.$store.dispatch("subscription/discounts/add", user);
    },
    remove(userId) {
      this.$store.dispatch("subscription/discounts/remove", userId);
    },
    togle(user) {
      const amount = document.getElementById(`discount_user_amount-${user.id}`)
        .value;
      const months = document.getElementById(`discount_user_months-${user.id}`)
        .value;
      this.$store.dispatch(`subscription/discounts/toggle`, {
        userId: user.id,
        amount: parseInt(amount),
        months: parseInt(months),
        isActive: !user.isActive
      });
    },
    addUser(user) {
      const isAlreadyInList = this.users.find(item => item.id === user.id);
      if (isAlreadyInList || user.id === this.user.id) {
        return;
      }
      this.add(user);
    },
    togleSearchResult(value) {
      this.showSearchResult = value;
    },
    time(date) {
      return fromNow(date);
    }
  },

  created() {
    this.init();
  }
};
</script>
