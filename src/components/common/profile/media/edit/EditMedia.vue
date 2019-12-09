<template>
  <div
    :class="['addPost', { loaderWrap: saving, truncated: !user.isPerformer }]"
    v-click-outside="() => (expanded = false)"
  >
    <form
      :class="[
        'add-new-form',
        {
          expanded: isExtended,
          'bg-gradient_light': $mq === 'desktop'
        }
      ]"
    >
      <div class="addPost-header" v-if="$mq === 'mobile'">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">
            Edit video
          </h1>
        </button>
        <div class="addPost-header__controls">
          <button
            type="submit"
            class="btn submit sm"
            :disabled="!isDataChanged"
            @click.prevent="saveClickHandler"
          >
            Save
          </button>
        </div>
      </div>
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
        v-if="$mq === 'desktop'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </span>
      <div
        class="text-media-container"
        :class="{ 'text-field-border': $mq === 'desktop' }"
      >
        <vue-tribute :options="tributeOptions">
          <textarea
            @focus="() => (expanded = true)"
            class="sm content-editable textarea"
            contenteditable
            placeholder="Enter description here"
            maxlength="1000"
            v-model="media.text"
            ref="textarea"
            :disabled="saving"
          ></textarea>
        </vue-tribute>
      </div>
      <div class="actions">
        <div class="actions-controls alignFlexCenter">
          <template v-if="isExtended">
            <div class="btn-post">
              <div>Price</div>
              <div
                class="price-amount-field getPaidForm__field enabled-tooltip"
              >
                <input
                  type="number"
                  name="paidPrice"
                  placeholder="Enter price"
                  class="getPaidAmountPlaceholder"
                  v-model="media.price"
                  step="0.01"
                  min="0"
                  :max="maxPrice"
                />
              </div>
              <div class="b-check-state b-check-state_post alignFlexCenter">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="media.active"
                  />
                  <span
                    class="b-check-state__icon icn-item icn-size_lg ml-2"
                  ></span>
                  <span class="b-check-state__text">Active</span>
                </label>
              </div>
              <div class="b-check-state b-check-state_post alignFlexCenter">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="media.free"
                  />
                  <span
                    class="b-check-state__icon icn-item icn-size_lg ml-2"
                  ></span>
                  <span class="b-check-state__text">Free</span>
                </label>
              </div>
            </div>
          </template>
        </div>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="!isDataChanged"
          @click.prevent="saveClickHandler"
          v-if="$mq === 'desktop'"
        >
          Save
        </button>
      </div>
      <div class="loader-container loader-container_center" v-if="saving">
        <Loader
          :fullscreen="false"
          :small="true"
          :semidark="true"
          class="text-light"
        />
      </div>
    </form>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import ClickOutside from "vue-click-outside";
import { Settings } from "luxon";
import UserMixin from "@/mixins/user";
import "vue-datetime/dist/vue-datetime.css";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";

Settings.defaultLocale = "en";

const InitialState = {
  expanded: false,
  media: {
    active: false,
    text: "",
    price: 0,
    free: false
  },
  saving: false,
  withoutWatermark: false,
  maxPrice: 500
};

export default {
  name: "EditMedia",
  mixins: [UserMixin, UserSuggestions],
  data() {
    return {
      ...InitialState
    };
  },
  components: {
    Loader,
    VueTribute
  },
  props: {
    initialExpanded: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    post: {
      type: Object,
      default: () => ({})
    },
    where: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    isExtended() {
      return this.expanded || this.initialExpanded;
    },
    isDataChanged() {
      return (
        this.$props.post.text !== this.media.text ||
        this.$props.post.active !== this.media.active ||
        String(this.$props.post.price) !== String(this.media.price)
      );
    },
    isPriceSetLimit() {
      return +this.media.price > 0 && +this.media.price <= 500;
    }
  },
  watch: {
    ["media.price"](value) {
      if (value == 0) {
        this.media.free = true;
      } else {
        this.media.free = false;
      }
    },
    ["media.free"](value) {
      if (value == true) {
        this.media.price = 0;
      }
    }
  },
  methods: {
    getConvertedText() {
      const pattern =
        '<span class="emoji-outer emoji-sizer"><span class="emoji-inner emoji.+?" data-code="(.+?)"></span></span>';
      let text = this.post.text.replace(
        new RegExp(pattern, "ug"),
        (m, unicode) => {
          return unicode;
        }
      );
      text = text.replace(/<br \/>/g, "\n");
      return text.replace(/(<([^>]+)>)/gi, "");
    },
    initData() {
      const { text, price, active } = this.$props.post;
      this.media.text = text;
      this.media.price = price;
      this.media.active = active;
    },
    clearData() {
      this.text = "";
      this.price = 0;
      this.active = false;
    },
    saveClickHandler() {
      this.saving = true;
      this.$store
        .dispatch(
          "profile/media/updateMedia",
          { media: this.media, productId: this.$props.post.productId },
          { root: true }
        )
        .then(() => {
          this.saving = false;
          this.close();
        });
    }
  },
  mounted() {
    // if (this.$refs.textarea) {
    //   this.$refs.textarea.focus();
    // }
    this.initData();
  },
  beforeDestroy() {
    this.clearData();
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.alignFlexCenter {
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 10px;
}
</style>
