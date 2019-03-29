<template>
  <div class="ReferralsView">
    <h1 class="form-title" v-if="$mq === 'desktop'">
      Referral URL
      <!-- QR temporary hidden -->
      <!--<button type="button">Show QR</button>-->
    </h1>
    <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
      <div class="inner">
        <span class="semi-transparent">
          Referral URL
        </span>
        <!-- QR temporary hidden -->
        <!-- <button type="button">Show QR</button> -->
      </div>
    </div>
    <div class="border-top shadow-block referrals-link">
      <a :href="url">{{ url }}</a>
      <div class="referral-desc">
        <p class="subtext">
          Refer creators to
          {{ $root.isAvnApp ? "stars.avn.com" : "OnMyTeam.com" }} receive 5% of
          their earnings as a bonus!
        </p>
        <button
          type="button"
          class="btn border alt btn-copy-url"
          @click="copyToClipboard"
        >
          Copy<span class="hidden-mobile" v-if="$mq === 'desktop'"> link</span>
        </button>
      </div>
    </div>
    <div class="ReferralsBlockCollectionView PayoutsRequestsCollectionView">
      <div
        class="form-title border-top table-header-title referrals-form-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
      >
        <div class="bg-gradient__shadow bg-gradient__shadow_mob">
          <div class="inner">
            <span class="semi-transparent referrals-text">
              Referrals
            </span>
            <!--
            <form class="referrals-search b-search-form">
              <input type="text" class="rounded sm" placeholder="Search"/>
              <button
                type="submit"
                disabled=""
                class="b-search-form__btn"
              ></button>
            </form>
            -->
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
      <div class="shadow-block no-padding">
        <div class="table-wrapper">
          <div class="table payouts-table">
            <div class="PayoutsRequestsView">
              <div class="item" v-for="v in items" :key="v.id">
                <div class="user table__cell">{{ v.name }}</div>
                <div
                  class="amount table__cell table__cell_align table__cell_align-hor-c"
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
          </div>
          <div class="empty-table-info"><span>Empty here for now</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Common from "../common";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "ReferralsSettingsContent",

  mixins: [Common],

  components: {},

  computed: {
    url() {
      return (
        window.location.origin +
        "/" +
        this.user.username +
        "/?code=" +
        this.user.referralUrl
      );
    },
    items() {
      return this.$store.state.referrals.items;
    }
  },

  methods: {
    copyToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", "Referral URL copied!");
      });
    },
    time(date) {
      return fromNow(date);
    }
  },

  mounted() {
    this.$store.dispatch("referrals/fetch");
  }
};
</script>
