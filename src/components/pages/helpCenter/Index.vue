<template>
  <div class="profile">
    <div class="white-bg-block">
      <div class="bg-profile size-lg">
        <div class="bg-wrap bg-color bg-gradient_standart">
          <div class="container">
            <div class="support-header">
              <h1>Help Center</h1>
              <form action="#" class="support-search-form">
                <input type="text" class="lg rounded">
                <button type="button" class="b-search-form__btn b-search-form__btn_mob header-search-submit lg" disabled="disabled"></button>
              </form>
              <div class="popular-questions">
                <a href="#" class="question-item">
                  How Do I Sign Up?
                </a>
                <a href="#" class="question-item">
                  What Is A Direct Message?
                </a>
                <a href="#" class="question-item">
                  How Can I Find My Friends
                </a>
                <a href="#" class="question-item">
                  I Forgot My Password
                </a>
                <a href="#" class="question-item">
                  Can I Tweet Videos?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="s-container support-content">
        <div class="container">
          <div class="s-header text-centered">
            <h2>AVN Stars Support</h2>
            <p>Get instant answers for the most common questions and learn how to share like a pro.</p>
          </div>
          <div class="cols">
            <div class="col col-1-4">
              <div class="questions-list">
                <ul v-if="items && items.length">
                  <NodeTree v-for="node in items" :node="node" :key="node.id" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="site-footer site-footer_main">
        <div class="container">
          <div class="FooterNavCollectionView">
            <div class="footer-nav">
              <div class="FooterNavView">
              <a href="/terms" class="">Terms</a>
              </div>
              <div class="FooterNavView">
                <a href="/privacy" class="">Privacy</a>
              </div>
              <div class="FooterNavView">
                <a href="/contact" class="">Contact</a>
              </div>
              <div class="FooterNavView">
                <a href="http://123.com" target="_blank">Billing support</a>
              </div>
              <div class="FooterNavView">
                <a href="/" class="active">OnMyTeam.com</a>
              </div>
              <div class="FooterNavView settings-onmyteam-link">
                <a href="/2257" class="">18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NodeTree from "./NodeTree";

export default {
  components: {
    NodeTree
  },
  computed: {
    items() {
      return this.$store.state.support.items;
    }
  },
  mounted() {
    this.$store.dispatch("support/fetch");
  }
};
</script>
