<template>
  <div class="BlockedUsersCollectionView">
    <div
      class="form-title border-top table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent">
            {{ title }}
            <p class="subtext">
              {{ subtext }}
            </p>
          </span>

          <form class="blocked-search b-search-form">
            <input
              type="text"
              class="rounded sm"
              placeholder="Search"
              v-model="query"
            />
            <button
              type="submit"
              disabled=""
              class="b-search-form__btn icn-item"
            ></button>
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
            v-if="source === 'blockedPaid'"
            class="date table__cell table__cell_align-hor-c table__cell_selected"
          >
            Price
          </div>
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
          >
            Status
          </div>
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
                  <span
                    class="avatar avatar_sm"
                    :class="{ 'online-state': isOnline(v.id) }"
                  >
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
                v-if="source === 'blockedPaid'"
                class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_selected"
              >
                <span>${{ v.price }}</span>
              </div>
              <div
                class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
              >
                <button
                  type="button"
                  class="btn-unblock"
                  @click="unblock(v.id)"
                  v-tooltip="'Unblock'"
                >
                  <span class="icn-item icn-block"></span>
                </button>
              </div>
            </div>
          </template>
          <div v-else class="empty-table-info show shadow-block">
            <span>Nothing found</span>
          </div>
        </div>
        <div class="empty-table-info show shadow-block" v-else>
          <span>No one blocked yet</span>
        </div>
      </div>
    </div>
    <div
      class="go-blocked shadow-block no-padding hidden-desktop settings-nav__wrapper"
    >
      <div class="settings-nav">
        <div
          class="settings-nav__item settings-nav__item_arr empty"
          v-if="!items.length"
        >
          <span class="not-lspacing">
            Blocked
          </span>
          <span class="value">
            <span class="count">0</span>
            people
          </span>
        </div>
        <router-link
          :to="mobileBlockedRoute"
          v-else
          class="settings-nav__item settings-nav__item_arr"
        >
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
import { format } from "date-fns";
import User from "@/mixins/user";

export default {
  name: "BlockedUsers",
  mixins: [User],
  props: {
    title: {
      type: String,
      default: "Blocked users"
    },
    mobileBlockedRoute: {
      type: String,
      required: true
    },
    source: {
      type: String,
      default: "users"
    },
    subtext: {
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
    state() {
      if (this.source === "users") {
        return this.$store.state.blocked;
      } else if (this.source === "stories") {
        return this.$store.state.viewers;
      } else if (this.source === "blockedPosts") {
        return this.$store.state.blockedPosts;
      } else if (this.source === "blockedPaid") {
        return this.$store.state.blockedPaid;
      }
    },
    storePath() {
      if (this.source === "users") {
        return "blocked";
      } else if (this.source === "stories") {
        return "viewers";
      } else if (this.source === "blockedPosts") {
        return "blockedPosts";
      } else if (this.source === "blockedPaid") {
        return "blockedPaid";
      }
    },
    initItems() {
      return this.state.blocked;
    },
    items() {
      let users = this.state.blocked;
      const query = this.query.trim();
      if (query) {
        users = users.filter(v => v.name.match(new RegExp(query)));
      }
      return users;
    }
  },

  methods: {
    dt(date) {
      return format(new Date(date), "dd MMM");
    },
    unblock(userId) {
      this.$store.dispatch(this.storePath + "/unblock", userId).then(() => {
        if (this.source === "users" || this.source === "blockedPosts") {
          this.$store.dispatch(this.storePath + "/filterBlocked", userId);
        } else {
          this.$store.dispatch(this.storePath + "/fetchBlocked");
        }
      });
    }
  },

  created() {
    this.$store.dispatch(this.storePath + "/fetchBlocked");
  }
};
</script>
