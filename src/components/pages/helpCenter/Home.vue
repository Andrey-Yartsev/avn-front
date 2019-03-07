<template>
  <ContentWrapper>
    <template slot="content">
      <div class="s-container support-content shadow-block">
        <div class="container">
          <div class="s-header text-centered">
            <h2>AVN Stars Support</h2>
            <p>
              Get instant answers for the most common questions and learn how to
              share like a pro.
            </p>
          </div>
          <div class="support-cards cols">
            <div class="col col-1-4" v-for="v in sections" :key="v.id">
              <router-link
                :to="'/support/article/' + v.id"
                class="support-card"
              >
                <span
                  v-if="cssExists(v.icon)"
                  class="support-card__icon"
                  :class="'support-card__icon_' + v.icon"
                ></span>
                <span v-else class="support-card__icon support-card__icon_logo">
                  <component :is="'rl-support-icon-' + v.icon" />
                </span>
                <span class="support-card__title">{{ v.title }}</span>
                <span class="support-card__text">{{ v.shortDescription }}</span>
                <span class="support-card__btn">More</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="s-container bg-gradient bg-gradient_light support-content">
        <div class="container">
          <div class="cols">
            <div class="col col-1-2 col_align-right">
              <div class="s-header">
                <div class="subtitle">NEW FEATURES</div>
                <h2>Make View.me your own</h2>
                <p>
                  Lorem ipsum dolor sit amet, sed diam nonummy nibh euismod
                  tincidunt
                </p>
                <a href="#" class="btn lg">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="s-container support-content shadow-block">
        <div class="container">
          <div class="cols">
            <div class="col col-1-2">
              <div class="s-header">
                <div class="subtitle">QUICK ANSWERS</div>
                <h2>Trending Topics</h2>
                <ul>
                  <li>Lorem ipsum dolor sit amet, consectetuer?</li>
                  <li>Adipiscing elit, sed diam?</li>
                  <li>Nonummy nibh euismod tincidunt?</li>
                  <li>Ut laoreet dolore magna aliquam?</li>
                  <li>Erat volutpat ut wisi enim?</li>
                  <li>Ad minim veniam, quis nostrud?</li>
                  <li>Exerci tation ullamcorper?</li>
                  <li>Suscipit lobortis nisl ut aliquip ex ea commodo?</li>
                  <li>Duis autem vel eum iriure?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import HeaderScrolled from "@/mixins/headerScrolled";

export default {
  mixins: [HeaderScrolled],
  components: {
    ContentWrapper
  },
  computed: {
    siteTitle() {
      return process.env.VUE_APP_TITLE;
    },
    sections() {
      return this.$store.state.support.items;
    }
  },
  methods: {
    cssExists(icon) {
      return ["account", "problems", "reports"].indexOf(icon) !== -1;
    }
  }
};
</script>
