<template>
  <div class="BlockedUsersCollectionView">
    <div class="form-title border-top table-header-title">
      <div class="inner">
        <span class="semi-transparent">
          Blocked users
          <p class="subtext">
            These people can't see your posts, stories and live streams
          </p>
        </span>

        <form class="blocked-search b-search-form">
          <input
            type="text"
            class="rounded sm"
            placeholder="Search"
            v-model="query"
          />
          <button type="submit" disabled="" class="b-search-form__btn"></button>
        </form>
      </div>
      <div class="table-header blocked-table-header ">
        <div class="user table__cell">
          User
        </div>
        <div
          class="date table__cell table__cell_align-hor-c table__cell_selected"
        >
          Date
        </div>
        <div
          class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
        >
          Status
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="table-wrapper">
        <div class="table blocked-table" v-if="initItems.length">
          <template v-if="items.length">
            <div class="item" v-for="v in items" v-bind:key="v.id">
              <div class="table__cell">
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
                class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_selected"
              >
                <time datetime="">{{ dt(v.blockedAt) }}</time>
              </div>
              <div
                class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
              >
                <button
                  type="button"
                  class="btn-unblock"
                  @click="unblock(v.id)"
                ></button>
              </div>
            </div>
          </template>
          <div v-else class="empty-table-info shadow-block">
            <span>Nothing found</span>
          </div>
        </div>
        <div class="empty-table-info shadow-block" v-else>
          <span>No one blocked yet</span>
        </div>
      </div>
    </div>
    <div
      class="go-blocked shadow-block no-padding hidden-desktop settings-nav__wrapper"
    >
      <div class="settings-nav">
        <div class="settings-nav__item empty" v-if="!items.length">
          <span class="not-lspacing">
            Blocked
          </span>
          <span class="value">
            <span class="count">0</span>
            people
          </span>
        </div>
        <router-link :to="mobileBlockedRoute" v-else class="settings-nav__item">
          <span class="not-lspacing">
            Blocked
          </span>
          <span class="value">
            <span class="count">{{ items.length }}</span>
            people
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";

export default {
  name: "BlockedUsers",

  props: {
    mobileBlockedRoute: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      query: ""
    };
  },

  computed: {
    initItems() {
      return this.$store.state.blocked.users;
    },
    items() {
      let users = this.$store.state.blocked.users;
      const query = this.query.trim();
      if (query) {
        users = users.filter(v => v.name.match(new RegExp(query)));
      }
      return users;
    }
  },

  methods: {
    dt(date) {
      return dateFns.format(new Date(date), "DD MMM");
    },
    unblock(userId) {
      this.$store.dispatch("blocked/unblock", userId);
    }
  },

  created() {
    this.$store.dispatch("blocked/fetchUsers");
  }
};
</script>

<style scoped>
.empty-table-info {
  display: block;
}
</style>
