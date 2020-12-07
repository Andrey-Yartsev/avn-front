<template>
  <div
    class="ReferralsBlockCollectionView PayoutsRequestsCollectionView settings-wrapper"
  >
    <div
      class="form-title border-top table-header-title referrals-form-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent referrals-text"> Referrals</span>

          <form class="referrals-search b-search-form">
            <input
              type="text"
              class="rounded sm"
              placeholder="Search"
              v-model="filter"
            />
            <button
              type="submit"
              disabled=""
              class="b-search-form__btn icn-item"
            ></button>
          </form>
        </div>
        <div class="table-header referrals-table-header">
          <div class="user table__cell">
            User
          </div>
          <div
            class="amount table__cell table__cell_align table__cell_align-hor-c table__cell_selected"
          >
            Amount
          </div>
          <div
            class="joined table__cell table__cell_align table__cell_align-hor-c"
          >
            Joined
          </div>
        </div>
      </div>
    </div>
    <div
      class="shadow-block no-padding"
      :class="{ 'table-empty': items.length === 0 }"
    >
      <div class="table-wrapper">
        <div class="table payouts-table">
          <div class="item" v-for="v in items" :key="v.id">
            <div class="user table__cell">
              <router-link :to="'/' + v.username" class="userview-block">
                <span class="avatar avatar_sm">
                  <span class="avatar__img">
                    <img :src="v.avatar" v-if="v.avatar" />
                  </span>
                </span>
                <div class="name">{{ v.name }}</div>
                <span class="user-login reset-ml">{{ v.username }}</span>
              </router-link>
            </div>
            <div
              class="amount table__cell table__cell_align table__cell_selected table__cell_align-hor-c"
            >
              ${{ v.bonusSum }}
            </div>
            <div
              class="joined table__cell table__cell_align table__cell_align-hor-c"
            >
              {{ time(v.joinedAt) }}
            </div>
          </div>
        </div>
        <div class="empty-table-info"><span>Empty here for now</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "SettingsReferralsList",
  data() {
    return {
      filter: ""
    };
  },
  computed: {
    items() {
      const items = this.$store.state.referrals.items;
      if (this.filter) {
        return items.filter(v => {
          if (v.username.match(new RegExp(".*" + this.filter + ".*"))) {
            return true;
          }
          if (v.name.match(new RegExp(".*" + this.filter + ".*"))) {
            return true;
          }
          return false;
        });
      }
      return items;
    }
  },
  methods: {
    time(date) {
      return format(new Date(date), "dd MMM");
    }
  },
  mounted() {
    this.$store.dispatch("referrals/fetch");
  }
};
</script>
