<template>
  <div class="SettingsNotificationsView">
    <form v-on:submit.stop.prevent="save">
      <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
        Nomination Settings
      </h1>

      <div
        class="form-nomination"
        :class="{
          'border-top': $mq === 'desktop',
          'shadow-block': $mq === 'mobile' && !url
        }"
      >
        <div
          :class="{
            'shadow-block': url
          }"
        >
          <div class="container">
            <div class="form-group form-group_with-label">
              <div
                class="form-group-inner"
                :class="{ 'form-group-title': $mq === 'desktop' }"
              >
                <span class="label">Choose the event</span>
                <div class="select-wrapper">
                  <select v-model="eventId">
                    <option value="91">AVN Awards</option>
                    <option value="92">GayVN Awards</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-if="eventId">
          <div
            class="border-top shadow-block_b-gap-md loader-container"
            :class="{ 'border-top_bgap shadow-block': $mq === 'desktop' }"
            v-if="loadingCategories"
          >
            <Loader :fullscreen="false" :inline="true" text="" :small="true" />
          </div>

          <template v-else>
            <div class="border-top referrals-link" v-if="url">
              <div class="referrals-url referrals-url_row">
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
            </div>

            <div
              class="border-top gaps-around-selects"
              :class="{
                'shadow-block shadow-block_b-gap-sm': url,
                'shadow-block_reset-pt': !url
              }"
            >
              <div class="container">
                <div
                  class="row row_separate-line"
                  v-for="(selects, i) in selects"
                  :key="i"
                >
                  <div
                    :class="{
                      'col-3-4': $mq === 'mobile',
                      'col-1-2': $mq === 'desktop'
                    }"
                  >
                    <div class="select-wrapper">
                      <select v-model="category[i]" @change="changeTrig">
                        <option
                          v-for="v in categories"
                          :key="v.id"
                          :value="v.id"
                          >{{ v.title }}</option
                        >
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn-unblock"
                    data-original-title="null"
                    v-if="hasRemoveButton(i)"
                    @click="remove(i)"
                  >
                    <span class="icn-item icn-block"></span>
                  </button>
                </div>
              </div>
            </div>

            <div
              class="form-group form-group_with-label"
              v-if="selects.length"
              v-for="(selects, i) in selects"
              :key="i"
            >
              <div class="form-group-inner form-group-title"></div>
            </div>

            <div class="form-group form-group_with-label" v-if="$mq === 'desktop'">
              <button
                type="submit"
                class="btn lg btn_fix-width saveChanges"
                :class="{ 'btn_form-gap': $mq === 'desktop' }"
                :disabled="!changed || loading"
              >
                Save changes
              </button>
            </div>
          </template>
        </template>
      </div>
      <div class="text-centered" v-if="$mq === 'mobile'">
        <button
          type="submit"
          class="btn lg btn_fix-width saveChanges"
          :class="{ 'btn_form-gap': $mq === 'desktop' }"
          :disabled="!changed || loading"
        >
          Save changes
        </button>
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
    loadingCategories() {
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
    changeTrig() {
      this.category = Object.assign({}, this.category);
    },
    fetchCategories() {
      this.$store.dispatch("awards/fetchCategories", this.eventId);
    },
    hasRemoveButton(n) {
      return this.selects.length !== n + 1;
    },
    remove(n) {
      const c = Object.assign({}, this.category);
      delete c[n];
      const r = {};
      Object.values(c).forEach((v, i) => {
        r[i + ""] = v;
      });
      this.category = r;
    },
    copyToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "URL copied!"
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
