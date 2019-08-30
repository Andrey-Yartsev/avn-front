<template>
  <div class="SettingsNotificationsView">
    <form v-on:submit.stop.prevent="save">
      <h1 class="form-title" v-if="$mq === 'desktop'">
        Nomination Settings
      </h1>

      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label">
            <div class="form-group-inner form-group-title">
              <span class="label">Chose the event</span>
              <select v-model="eventId">
                <option value="91">AVN</option>
                <option value="92">AVN Gay</option>
              </select>
            </div>
          </div>

          <template v-if="eventId">
            <div
              class="border-top shadow-block loader-container loader-container_center"
              v-if="loading"
            >
              <Loader
                :fullscreen="false"
                :inline="true"
                text=""
                :small="true"
              />
            </div>

            <template v-else>
              <div class="border-top shadow-block referrals-link" v-if="url">
                <div class="referrals-url">
                  <a :href="url" class="referrals-url__link">{{ url }}</a>
                  <button
                    type="button"
                    class="btn btn_fix-width-sm border alt btn-copy-url"
                    @click="copyToClipboard"
                  >
                    Copy<span class="hidden-mobile" v-if="$mq === 'desktop'">
                      link</span
                    >
                  </button>
                </div>
                <div class="referral-desc">
                  <p class="subtext"></p>
                </div>
              </div>

              <div class="table-wrapper">
                <div class="table blocked-table">
                  <div class="item" v-for="(selects, i) in selects" :key="i">
                    <div class="table__cell">
                      <select v-model="category[i]">
                        <option
                          v-for="v in categories"
                          :key="v.id"
                          :value="v.id"
                          >{{ v.title }}</option
                        >
                      </select>
                    </div>

                    <div
                      class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c actions"
                    >
                      <button
                        type="button"
                        class="btn-unblock has-tooltip"
                        data-original-title="null"
                        v-if="hasRemoveButton(i)"
                        @click="remove(i)"
                      >
                        <span class="icn-item icn-block"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="form-group form-group_with-label"
                v-for="(selects, i) in selects"
                :key="i"
              >
                <div class="form-group-inner form-group-title"></div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div class="container hidden-mobile" v-if="$mq === 'desktop'">
        <div class="form-group form-group_with-label">
          <button
            type="submit"
            class="btn lg btn_fix-width saveChanges btn_form-gap"
            :disabled="!changed"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Common from "../common";
import Loader from "@/components/common/Loader";
import User from "@/mixins/user";

export default {
  name: "NominationSettingsContent",
  mixins: [Common, User],
  components: { Loader },
  data() {
    return {
      eventId: 91,
      category: {},
      catN: 0
    };
  },
  computed: {
    url() {
      const values = Object.values(this.category);
      if (!values.length) {
        return null;
      }
      // nominator/id468312/avn_awards/15,121
      let url = window.location.origin;
      url += "/nominator/";
      url += this.user.username + "/";
      if (this.eventId == 91) {
        url += "avn_awards";
      } else {
        url += "gayvn_awards";
      }
      url += "/" + values.filter(v => v !== 0).join(",");
      return url;
    },
    categories() {
      if (!this.$store.state.awards.categories) {
        return [];
      }
      return this.$store.state.awards.categories.data;
    },
    selects() {
      let r = Object.values(this.category);
      if (!r.length) {
        return [0];
      }
      r.push(0);
      return r;
    },
    loading() {
      return this.$store.state.awards.fetchCategoriesLoading;
    }
  },
  watch: {
    eventId() {
      if (this.eventId) {
        this.fetchCategories();
        this.category = {};
      }
    },
    category(category) {
      this.localUser.nominationCategories = JSON.stringify(category);
    }
  },
  methods: {
    fetchCategories() {
      this.$store.dispatch("awards/fetchCategories", this.eventId);
    },
    hasRemoveButton(n) {
      return this.selects.length !== n + 1;
    },
    remove(n) {
      delete this.category[n];
      this.category = Object.assign({}, this.category);
    },
    copyToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Referral URL copied!"
        });
      });
    }
  },
  created() {
    this.fetchCategories();
    if (this.localUser.nominationCategories) {
      this.category = JSON.parse(this.localUser.nominationCategories);
    }
  }
};
</script>
