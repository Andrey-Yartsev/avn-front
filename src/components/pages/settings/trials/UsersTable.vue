<template>
  <div>
    <div
      v-if="items && items.length"
      class="form-title table-header-title table-header-title_sticky border-top bg-gradient bg-gradient_pseudo"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent"> Trial Subscribers<br /><br /> </span>
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="table-wrapper" v-if="items && items.length">
        <div class="table">
          <div class="item">
            <div class="user table__cell">
              User
            </div>
            <div class="table__cell">
              Start
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_selected"
            >
              Days left
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
            >
              State
            </div>
          </div>

          <div class="item" v-for="v in items" :key="v.id">
            <div class="table__cell">
              <router-link :to="'/' + v.user.username" class="userview-block">
                <span class="avatar avatar_sm">
                  <span class="avatar__img">
                    <img :src="v.user.avatar" v-if="v.user.avatar" />
                  </span>
                </span>
                <div class="name">{{ v.user.name }}</div>
                <span class="user-login reset-ml">{{ v.user.username }}</span>
              </router-link>
            </div>
            <div class="table__cell">
              {{ dt(v.createdAt) }}
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_selected"
            >
              {{ v.days }}
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
            >
              {{ v.trialState }}
            </div>
            <!--
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
          >
            <button type="button" class="btn-unblock"></button>
          </div>
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_remove"
          >
            <button type="button" class="btn_delete" @click="remove(v)"></button>
          </div>
          --></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  computed: {
    items() {
      return this.$store.state.trial.getModelsResult;
    }
  },
  methods: {
    remove(user) {
      this.$emit("remove", user);
    },
    dt(date) {
      return moment(date).format("MMM DD, hh:mm");
    }
  },
  created() {
    this.$store.dispatch("trial/getModels");
  }
};
</script>
