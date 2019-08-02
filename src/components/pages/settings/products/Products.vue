<template>
  <div class="payments-statements">
    <div class="paymentsStatementsView">
      <div class="payments-wrapper payments-wrapper_gap-over">
        <div
          class="form-title table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
        >
          <div class="bg-gradient__shadow bg-gradient__shadow_mob">
            <div class="inner">
              <span class="semi-transparent">
                My Purchases
              </span>
            </div>
            <div class="table-header payments-table-header">
              <div class="date table__cell">Date</div>
              <div
                class="product table__cell table__cell_align table__cell_align-hor-c"
              >
                Product
              </div>
              <div class="user user_purchases table__cell">User</div>
              <div
                class="amount table__cell table__cell_selected  table__cell_align table__cell_align-hor-c"
              >
                Price
              </div>
            </div>
          </div>
        </div>
        <div class="shadow-block no-padding">
          <div class="table-wrapper">
            <div class="table payments-table" v-if="products.length">
              <template>
                <div
                  class="PaymentsStatementsCollectionItemView"
                  v-for="(v, i) in products"
                  :key="i"
                >
                  <div class="item">
                    <div
                      class="date table__cell table__cell_align table__cell_align-vert-c"
                    >
                      {{ dt(v.createdAt) }}
                    </div>
                    <div
                      class="product table__cell table__cell_align table__cell_align-vert-c"
                    >
                      <span class="product">{{ v.title }}</span>
                    </div>
                    <div class="user user_purchases table__cell">
                      <router-link
                        :to="'/' + v.userId"
                        target="_blank"
                        class="payment-user-wrapper"
                      >
                        <!-- <span class="avatar avatar_sm">
                          <span class="avatar__img">
                            <img
                              :src="v.userTo.avatar"
                              v-if="v.userTo.avatar"
                            />
                          </span>
                        </span> -->
                        <span class="user-login reset-ml">{{ v.userId }}</span>
                        <!-- <span class="user-login reset-ml">{{ v.userId }}</span> -->
                      </router-link>
                    </div>
                    <div
                      class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c table__cell_align-vert-c"
                    >
                      ${{ v.price }}
                    </div>
                    <!-- <div
                      class="status table__cell table__cell_align table__cell_align-vert-c"
                    >
                      <span class="success icn-item" v-if="v.isSuccess"></span>
                    </div> -->
                  </div>
                </div>
              </template>
            </div>
            <div
              class="empty-table-info show"
              v-if="!products.length && !productsLoading"
            >
              <span>You haven’t bought anything yet</span>
            </div>
            <div class="loader-infinity" v-if="productsLoading">
              <Loader
                :fullscreen="false"
                :inline="true"
                text=""
                class="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import moment from "moment";
import InfinityScroll from "@/mixins/infinityScroll";

export default {
  name: "ProductsSettingsProducts",
  mixins: [InfinityScroll],
  components: {
    Loader
  },
  computed: {
    products() {
      return this.$store.state.products.list;
    },
    purchasesLoading() {
      return this.$store.state.products.loading;
    }
  },
  methods: {
    dt(date) {
      return moment(date).format("DD MMM");
    }
  },
  created() {
    this.$store.dispatch("products/fetch");
  }
};
</script>
