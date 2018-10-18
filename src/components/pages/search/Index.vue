<template>
  <div class="searchView">
    <div class="container">
      <div class="over-container">
        <nav class="explore-nav">
          <router-link
            v-for="v in types"
            v-bind:key="v.name"
            :to="'/search/' + v.name + '/' + query"
            :class="{active: v.active}"
          >{{ v.title }}</router-link>
        </nav>
        <div class="explore">
          <div class="userCollectionView">
            <div class="users">
              <div class="userView" v-for="v in items" v-bind:key="v.id">
                <div class="bg"><img v-if="v.header" :src="v.header" /></div>
                <div class="user-container">
                  <div class="avatar"><img v-if="v.avatar" :src="v.avatar" /></div>
                  <div class="names-actions-wrapper">
                    <div class="user-names">
                      <div class="wrap-name">
                        <router-link :to="'/' + v.username" class="name">{{ v.name }}</router-link>
                      </div>
                      <span class="user-login">
                        <router-link :to="'/' + v.username">{{ v.username }}</router-link>
                      </span>
                    </div>
                    <div class="user-actions">


                      <div class="subscribePaidView" v-if="v.subscribePrice">
                        <div class="subscribe-cost " id="subscribe-paid">
                          <div class="subscribe-cost__value">
                            $<span>{{ v.subscribePrice }}</span>/mo.
                          </div>
                          <div class="subscribe-cost__label">
                            Subscribe
                          </div>
                        </div>
                      </div>

                      <span class="subscribeView" v-if="!v.subscribedBy">
                        <div
                          class="profile-actions__btn btn-subscribe"
                          @click="v.followedBy ? unfollow(v.id) : follow(v.id)"
                        >
                          <div class="btn-subscribe__label">
                            {{ v.followedBy ? "Unfollow" : "Follow" }}
                          </div>
                        </div>
                      </span>
                      <div class="more-functions hidden-mobile">
                        <div class="more-functions__btn more-functions__btn_with-text">
                          <div class="more-functions__btn-text">
                            More
                          </div>
                        </div>
                        <div class="more-functions__dropdown">
                          <div class="more-functions__dropdown-inside">
                            <ul>
                              <li><a href="#" @click.prevent="report(v.id)">Report</a></li>
                              <li v-if="v.isBlocked"><a href="#" @click.prevent="unblock(v.id)">Unblock</a></li>
                              <li v-else><a href="#" @click.prevent="block(v.id)">Block</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div class="no-results-search" v-if="loading">
              <div class="no-results-search__message">
                <span class="no-results-search__text">Loading</span>
              </div>
            </div>

            <div class="no-results-search" v-else>
              <div class="no-results-search__message">
                <span class="no-results-search__text">Nothing found for</span>
                <span class="searchAllTag">"{{ query }}"</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const types = {
  users: "People",
  posts: "Posts",
  videos: "Videos",
  photos: "Photos"
};

export default {
  name: "Search",

  computed: {
    query() {
      return this.$route.params.query;
    },
    type() {
      return this.$route.params.type;
    },
    items() {
      return this.$store.state.search.page.items;
    },
    types() {
      return Object.entries(types).map(v => {
        return {
          name: v[0],
          title: v[1],
          active: v[0] === this.type
        };
      });
    },
    loading() {
      return this.$store.state.search.page.searchLoading;
    }
  },

  methods: {
    search() {
      this.$store.dispatch("search/page/search", {
        query: this.query,
        offset: 0,
        limit: 10
      });
    },
    follow(userId) {
      this.$store.dispatch("search/page/follow", userId);
    },
    unfollow(userId) {
      this.$store.dispatch("search/page/unfollow", userId);
    },
    report(userId) {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: userId
      });
    },
    block(userId) {
      this.$store.dispatch("search/page/block", userId);
    },
    unblock(userId) {
      this.$store.dispatch("search/page/unblock", userId);
    },
    changeType(type) {
      this.$router.push(`/search/${type}/${this.query}`);
    }
  },

  watch: {
    query() {
      this.search();
    },
    type() {
      if (this.type !== "users") {
        this.$store.commit("search/page/reset");
        return;
      }
      this.search();
    }
  },

  created() {
    this.search();
  }
};
</script>

<style scoped>
.no-results-search {
  display: block;
}
</style>
