<template>
  <div class="container">
    <div class="awards-header">
      <img
        :src="cdnPath + 'static/img/avnawards.png'"
        alt=""
        class="logo-awards"
        v-if="!isGay"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1146 440"
        class="logo-awards"
        v-else
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path
              class="cls-1"
              d="M0,130c1.82-8.71,3-17.61,5.58-26.09C19.41,58.18,50.42,28.93,94.65,13,121.27,3.48,148.84.87,177,2.81c28.7,2,56.39,7.73,82.79,19.28,2,.86,3.87,1.83,5.94,2.82V85.66C253.87,81,242.21,76,230.27,71.74c-24.37-8.62-49.62-12.47-75.39-10.59-26.83,2-51.15,10.38-68.34,32.72-15.06,19.56-19.72,41.9-16.84,66.19C74,196.63,102,220.62,136.09,227.29c23,4.49,45.15,3.26,66.64-6.4.44-.2.84-.51,1.55-.94V188.1H166.37V136.42h105.1V250.87c-9.45,10-21.79,16.74-34.92,22.09A204.55,204.55,0,0,1,164,288.07c-35.82.92-69.62-6.15-100.18-25.3-35.18-22.06-55.86-54-62.66-95C.79,165.5.39,163.25,0,161Z"
            />
            <path
              class="cls-1"
              d="M454,0c5.14,12.75,10.14,25.56,15.43,38.25Q520,159.5,570.62,280.69c.44,1,.79,2.12,1.37,3.72H498q-10.79-27.6-21.75-55.69h-117q-9.78,27.5-19.83,55.71h-73c4.57-12.06,8.9-23.51,13.22-35L374,0Zm2.2,177.92c-13.71-35.15-27.31-70-41.37-106.1l-37.58,106.1Z"
            />
            <path
              class="cls-1"
              d="M809,0c-4.3,10.94-8.47,21.94-12.92,32.81Q745.43,156.45,694.68,280c-.5,1.22-1.12,2.39-1.76,3.75H655c-4.15-10-8.43-20.23-12.64-30.49q-51-124.29-102-248.62A45.83,45.83,0,0,1,539,0h65a42.29,42.29,0,0,0,1.2,5.65q24.06,67.89,48.22,135.76c5.6,15.74,11.22,31.47,17.07,47.87.76-1.92,1.27-3.14,1.72-4.38Q701.12,104.46,730,24c2.84-7.93,5.34-16,8-24Z"
            />
            <path
              class="cls-1"
              d="M526,0q58.82,142.86,117.56,285.74c.87,2.14,1.5,5,.83,7.06-10.89,33.5-22,66.93-33.21,100.77-14.78,9.43-29.73,19-44.75,28.53-9.1,5.74-18.31,11.31-27.47,17a37.66,37.66,0,0,1,.79-4.77q22.31-76.12,44.68-152.23c.23-.79.43-1.59.7-2.61q-15.75-36.42-31.6-73.07Q509.76,105.27,466,4.16A24.77,24.77,0,0,1,465,0Z"
            />
            <path
              class="cls-1"
              d="M727,0,670.7,156.32c-4.93-13.85-9.4-26.44-13.88-39-3-8.45-6.12-16.87-9-25.37-.65-1.94-1.16-4.35-.62-6.22C655.36,57.11,663.7,28.56,672,0Z"
            />
            <path
              class="cls-2"
              d="M1146,310l-10.71,11.25c-4.67-4.37-9.92-7.94-17-6.47-6.51,1.35-10.53,5.42-12.41,11.62s-1.81,12.39,3.3,17.11c4.13,3.83,8.89,7,13.31,10.48,12,9.54,14.74,22.11,11.31,36.31-3.24,13.46-11.72,22.41-25.42,25.12-13.54,2.69-25.71-.44-35.72-11.4l10.85-13.81c4.38,4.61,8.92,8.73,15.64,9,7.8.35,13.29-2.53,16.07-8.53,3.25-7,2.44-15.51-2.59-20.48a98,98,0,0,0-11.61-9.36c-12.69-9.14-16-21.73-12.63-36.17,3.15-13.71,11.58-23.28,25.73-26.11,10.44-2.09,20.57-.53,29.16,6.65A24.14,24.14,0,0,0,1146,307Z"
            />
            <path
              class="cls-1"
              d="M539.06,438.94,539,440h-1C538.35,439.65,538.71,439.3,539.06,438.94Z"
            />
            <path
              class="cls-1"
              d="M824.51,1h61.38L954.24,175l73.56-174h66.82Q1034.13,143.19,974,284.41H917.82l-70-184-77,183.9H703.93Z"
            />
            <path
              class="cls-2"
              d="M741.61,413.48H721.25c-.58-37.51-1.16-74.74-1.75-112.37h17.43v84.95l.82.23q14.09-42.69,28.17-85.41h18.82v86.23l1,.12q13.8-43.17,27.58-86.34h17c-13,37.76-25.83,75.14-38.71,112.59H770.68v-82l-1.3-.14Q755.49,372.44,741.61,413.48Z"
            />
            <path
              class="cls-2"
              d="M1007.39,301c11.11,0,21.78-.64,32.34.16,13.19,1,23.16,11.21,25.88,26.47,3.64,20.41,1.8,40.41-7.64,59.17-9,17.78-23.44,27-43.59,26.93-8.29,0-16.59,0-25.4,0C995.16,375.94,1001.24,338.66,1007.39,301ZM1022.21,317q-6.4,40.17-12.71,79.64c15.63,3.25,25.38-3.72,32.11-16.14,4.73-8.74,6.9-18.27,7.45-28.14.49-8.64.66-17.28-3-25.47-2.49-5.55-6.49-9.24-12.67-9.83C1029.78,316.67,1026.12,317,1022.21,317Z"
            />
            <path
              class="cls-2"
              d="M958.87,362.4c4.35,17.21,8.57,33.9,12.89,51H953.51q-5.43-23.51-11-47.8H932.36c-2.67,16-5.32,31.81-8,47.86H907.41q9.2-56.39,18.31-112.37c11.84,0,23.38-.8,34.75.22,12.72,1.14,20,10.73,20.24,24.81C981,342.55,975.58,355.84,958.87,362.4ZM934.6,351.23c3.87,0,7,.09,10.14,0,9.53-.3,16.29-6,18.18-15.31,2.25-11.11-1.27-18.05-10.45-19.52-4-.64-8.15-.11-12.18-.11C938.39,328,936.55,339.27,934.6,351.23Z"
            />
            <path
              class="cls-2"
              d="M843.44,389.59c-3.23,8-6.37,15.87-9.6,23.9H815.7c15.66-37.6,31.24-75,46.88-112.55h22.61c1.73,37.47,3.46,74.89,5.2,112.58H872.56V389.59Zm27.91-69-1.55-.22-21.19,54.08h22.74Z"
            />
            <path
              class="cls-2"
              d="M693.06,413.61H674.89v-24H646.16l-9.76,24H618.29c15.73-37.75,31.3-75.14,46.92-112.66h22.57C689.54,338.34,691.29,375.77,693.06,413.61ZM673.84,321l-1.57-.26c-6.94,17.76-13.88,35.53-21,53.68h22.55Z"
            />
          </g>
        </g>
      </svg>
    </div>
    <div class="awards-title text-centered">
      {{ sent ? "Thank you!" : "Pre-Nomination Form" }}
    </div>
    <template v-if="!sent">
      <div class="title-subtext text-centered">
        Pre-nominate your favorite star by entering their name under the
        category below:
      </div>
      <div class="loader-container" v-if="loading">
        <Loader text="" :fullscreen="false" :small="true" />
      </div>
      <form action="#" class="awards-form" @submit.prevent="send" v-else>
        <template v-if="predefined">
          <h3>Autofilled categories</h3>
          <Columns
            :categories="categories[0]"
            :value="modelUser.name"
            class="underscore"
            :disabled="true"
          />
          <h3>Additional Categories</h3>
        </template>

        <Columns :categories="categories[1]" @input="input" />
        <div class="hint-text-sm">
          * the length of the name must be from 2 to 150 characters
        </div>
        <div class="awards__btn-row">
          <button class="btn alt border lg" :disabled="sending || !canSend">
            Submit
          </button>
        </div>
      </form>
    </template>
    <template v-else>
      <Share
        v-if="$store.state.awards.categories"
        :categories="_categories"
        :data="data || this.$store.state.awards.savedData.data"
        :modelUser="modelUser"
        :isGay="isGay"
        @complete="complete"
      />
    </template>
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";
import Loader from "@/components/common/Loader";
import UserSearchField from "./UserSearchField";
import Columns from "./Columns";
import User from "@/mixins/user";
import Share from "./Share";
import BrowserStore from "store";

export default {
  name: "AvnAwards",
  mixins: [User],
  components: {
    Footer,
    Loader,
    UserSearchField,
    Columns,
    Share
  },
  data() {
    return {
      data: {}
    };
  },
  computed: {
    categories() {
      if (!this.predefined) {
        return [null, this.rearrangeByCols(this._categories)];
      }

      let a = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) !== -1;
      });
      let b = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) === -1;
      });
      if (a.length) {
        a = this.rearrangeByCols(a);
      }
      if (b.length) {
        b = this.rearrangeByCols(b);
      }
      return [a, b];
    },
    _categories() {
      if (!this.$store.state.awards.categories) {
        return [];
      }
      const cat = this.$store.state.awards.categories;
      return cat.data;
    },
    autofilledCatIds() {
      if (!this.$route.params.categories) {
        return [];
      }
      return this.$route.params.categories.split(",").map(v => {
        return parseInt(v);
      });
    },
    isGay() {
      if (this.predefined) {
        return this.$route.params.type !== "avn_awards";
      }
      return this.$route.meta.isGay;
    },
    predefined() {
      return !!this.$route.meta.predefined;
    },
    eventId() {
      return this.isGay
        ? process.env.VUE_APP_GAY_AWARDS_EVENT_ID
        : process.env.VUE_APP_AWARDS_EVENT_ID;
    },
    loading() {
      if (!this.predefined) {
        return this.$store.state.awards.fetchCategoriesLoading;
      }
      if (!this.modelUser) {
        return true;
      }
      return (
        this.$store.state.awards.fetchCategoriesLoading ||
        this.$store.state.awards.fetchUserLoading
      );
    },
    canSend() {
      const values = Object.values(this.data);
      if (values.length === 0) return false;
      const hasTooShort = values.some(item => {
        return item.length > 0 && item.length < 2;
      });
      if (hasTooShort) return false;
      return true;
    },
    sending() {
      return this.$store.state.awards.nominateLoading;
    },
    sent() {
      return this.$store.state.awards.nominateSuccess;
    },
    modelUsername() {
      return this.$route.params.username;
    },
    modelUser() {
      return this.$store.state.awards.fetchUserResult;
    },
    successText() {
      return "Your voting have been sent successfully";
    },
    page() {
      return this.isGay ? "gayvn_awards" : "avn_awards";
    },
    cdnPath() {
      return process.env.VUE_APP_CDN_PATH;
    }
  },
  watch: {
    loading(loading) {
      if (this.predefined && !loading) {
        if (!this.categories[0].length) {
          this.$router.push("/not-found");
        }
      }
    },
    eventId() {
      this.$store.dispatch("awards/fetchCategories", this.eventId);
    },
    user: {
      handler(value, oldValue) {
        if (value && !oldValue && this.$store.state.awards.savedData) {
          this.$store
            .dispatch("awards/nominate", this.$store.state.awards.savedData, {
              root: true
            })
            .then(() => {
              this.$store.commit("awards/clearSavedData", null, { root: true });
            });
        }
      },
      immediate: true
    }
  },
  methods: {
    input(v) {
      const o = {};
      o[v.id] = v.value;
      this.data = { ...this.data, ...o };
    },
    async send() {
      if (!this.user) {
        this.$store.commit("awards/saveData", {
          eventId: this.eventId,
          data: this.data,
          username: this.$route.params.username
        });

        this.$store.dispatch("modal/show", {
          name: "login",
          data: {
            disableClose: false,
            disableFooter: false
          }
        });
        this.$store.commit("global/toastShowTrigger", {
          text:
            "In order to prevent spam we need you to login to complete you ballot submission",
          type: "warning"
        });
      } else {
        this.$store
          .dispatch("awards/nominate", {
            eventId: this.eventId,
            data: this.data
          })
          .then(() => {
            if (this.predefined && this.sent) {
              // this.$router.push("/" + this.$route.params.username);
              // this.$store.dispatch("global/flashToast", {
              //   text: this.successText
              // });
              // this.$store.dispatch("awards/nominateReset");
            }
          });
      }
    },
    rearrangeByCols(items) {
      const columns = [[], [], []];
      let col = 0;
      for (let i = 0; i < items.length; i++) {
        columns[col].push(items[i]);
        col++;
        if (col % 3 === 0) {
          col = 0;
        }
      }
      return columns;
    },
    setPredefinedData() {
      const autofilledCats = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) !== -1;
      });
      autofilledCats.forEach(cat => {
        const o = {};
        o[cat.id] = this.modelUser.id;
        this.data = { ...this.data, ...o };
      });
    },
    reset() {
      this.data = {};
      this.$store.dispatch("awards/nominateReset");
    },
    complete() {
      this.reset();
      if (this.$route.path !== "/" + this.page + "/nominations") {
        this.$router.push("/" + this.page + "/nominations");
      }
    }
  },
  created() {
    // if (!this.user) {
    //   this.$store.dispatch("modal/show", {
    //     name: "login",
    //     data: {
    //       disableClose: true,
    //       disableFooter: true
    //     }
    //   });
    // }

    this.$store.dispatch("awards/fetchCategories", this.eventId).then(() => {
      if (this.predefined) {
        this.$store
          .dispatch("awards/fetchUser", this.modelUsername)
          .then(() => {
            this.setPredefinedData();
          })
          .catch(() => {
            this.$router.push("/not-found");
          });
      }
    });

    // let script = document.createElement("script");
    // script.onload = () => {
    //   this.scriptLoading = false;
    // };
    // script.async = true;
    // script.src = "https://platform.twitter.com/widgets.js";
    // document.head.appendChild(script);
  },
  mounted() {
    const storageData = BrowserStore.get("nomUserRegData");
    if (storageData) {
      this.data = storageData.data;
      BrowserStore.remove("nomUserRegData");
      if (!this.user) {
        this.$store.commit("awards/clearSavedData", null, { root: true });
        return;
      }
      this.$store
        .dispatch("awards/fetchUser", storageData.username)
        .then(() => {
          this.$store
            .dispatch(
              "awards/nominate",
              {
                eventId: storageData.eventId,
                data: storageData.data
              },
              {
                root: true
              }
            )
            .then(() => {
              this.$store.commit("awards/clearSavedData", null, { root: true });
            });
          this.setPredefinedData();
        })
        .catch(() => {
          this.$router.push("/not-found");
        });
    }
    const savedData =
      this.$store.state.awards.savedData &&
      this.$store.state.awards.savedData.data;
    if (savedData) {
      this.data = savedData;
    }
  },
  beforeDestroy() {
    this.reset();
  }
};
</script>
