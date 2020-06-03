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
          <UserDiscountItem
            v-for="item in users"
            :key="item.user.id"
            :item="item"
            @togle="togle"
            @remove="remove"
          />
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
import UserDiscountItem from "./UserDiscountItem";

export default {
  name: "UserDiscounts",
  mixins: [User],
  components: {
    SearchBubble,
    UserDiscountItem
  },
  props: {
    title: {
      type: String,
      default: "Personal discounts"
    },
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
    togle(item) {
      const amount = document.getElementById(
        `discount_user_amount-${item.user.id}`
      ).value;
      const months = document.getElementById(
        `discount_user_months-${item.user.id}`
      ).value;
      this.$store.dispatch(`subscription/discounts/toggle`, {
        ...item,
        amount: parseInt(amount),
        months: parseInt(months),
        isActive: !item.isActive
      });
    },
    addUser(user) {
      const isAlreadyInList = this.users.find(item => item.user.id === user.id);
      if (isAlreadyInList || user.id === this.user.id) {
        return;
      }
      this.add(user);
    },
    togleSearchResult(value) {
      this.showSearchResult = value;
    }
  },

  created() {
    this.init();
  }
};
</script>
