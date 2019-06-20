<template>
  <div>
    <div
      v-if="items && items.length"
      class="form-title table-header-title table-header-title_sticky border-top bg-gradient bg-gradient_pseudo"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent">Trial Subscribers</span>
        </div>
        <div class="table-header">
          <div class="user table__cell table__cell_user">
            User
          </div>
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_date"
          >
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
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_remove"
          />
        </div>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="table-wrapper" v-if="items && items.length">
        <div class="table">
          <div class="item" v-for="v in items" :key="v.id">
            <div class="user table__cell table__cell_user">
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
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_date"
            >
              <span class="table-value__date">{{ dt1(v.createAt) }}</span>
              <span class="table-value__time">{{ dt2(v.createAt) }}</span>
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
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_remove"
            >
              <button
                type="button"
                class="btn-reset btn-reset_fix-sizes btn-reset_sec-color icn-item icn-pos_center"
                @click="remove(v)"
              />
            </div>
            <!--
          <div
            class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
          >
            <button type="button" class="btn-unblock"><span class="icn-item icn-block"></span></button>
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
      this.$store
        .dispatch("trial/delete", {
          trialId: user.trialId
        })
        .then(() => {
          this.init();
        });
    },
    dt1(date) {
      return moment(date).format("MMM DD");
    },
    dt2(date) {
      return moment(date).format("HH:mm");
    },
    init() {
      this.$store.dispatch("trial/getModels", {});
    }
  },
  created() {
    this.init();
  }
};
</script>
