<template>
  <div class="userCollectionView">
    <div class="users">
      <div class="userView" v-for="v in items" v-bind:key="v.id">
        <div class="bg"><img v-if="v.header" :src="v.header"/></div>
        <div class="user-container">
          <div class="avatar"><img v-if="v.avatar" :src="v.avatar"/></div>
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
    <NoResults :query="query" :loading="loading" />
  </div>
</template>

<script>
import NoResults from "./NoResults";

export default {
  name: "SearchUsers",

  props: ["items", "query", "loading"],

  components: { NoResults }
};
</script>
