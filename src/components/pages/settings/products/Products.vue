<template>
  <div class="paymentsStatementsView settings-wrapper">
    <h1 class="form-title settings-title">My Library</h1>
    <div
      class="form-title table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo border-top"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent">
            Products
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
    <div
      class="shadow-block no-padding"
      :class="{ 'table-empty': !products.length && !productsLoading }"
    >
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
                    :to="'/' + v.productOwner.username"
                    target="_blank"
                    class="userview-block payment-user-wrapper"
                  >
                    <span
                      class="avatar avatar_sm"
                      :class="{ 'online-state': isOnline(v.productOwner.id) }"
                    >
                      <span class="avatar__img">
                        <img
                          :src="v.productOwner.avatar"
                          v-if="v.productOwner.avatar"
                        />
                      </span>
                    </span>
                    <span class="name">{{ v.productOwner.name }}</span>
                    <span class="user-login reset-ml">{{
                      v.productOwner.username
                    }}</span>
                  </router-link>
                </div>
                <div
                  class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c table__cell_align-vert-c"
                >
                  {{ showPrice(v.price) ? `$${v.price}` : "free access" }}
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
          <Loader :fullscreen="false" :inline="true" text="" :small="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import { format } from "date-fns";
import InfinityScroll from "@/mixins/infinityScroll";
import User from "@/mixins/user";

export default {
  name: "ProductsSettingsProducts",
  mixins: [InfinityScroll, User],
  components: {
    Loader
  },
  computed: {
    store() {
      return this.$store.state.products;
    },
    products() {
      return this.$store.state.products.list;
    },
    productsLoading() {
      return this.$store.state.products.loading;
    }
  },
  methods: {
    dt(date) {
      return format(new Date(date), "dd MMM");
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("products/fetch");
    },
    showPrice(price) {
      return parseFloat(price) > 0;
    }
  },
  created() {
    this.$store.dispatch("products/firstFetch");
  }
};
</script>
