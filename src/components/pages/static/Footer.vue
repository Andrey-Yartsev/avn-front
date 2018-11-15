<template>
  <div class="site-footer">
    <div class="container">
      <div class="FooterNavCollectionView">
        <div id="footer-nav" class="footer-nav ">
          <div class="FooterNavView"><router-link to="/terms">Terms</router-link></div>
          <div class="FooterNavView"><router-link to="/privacy">Privacy</router-link></div>
          <div class="FooterNavView"><router-link to="/contact">Contact</router-link></div>
          <div class="FooterNavView"><a href="http://epoch.com">Billing support</a></div>
          <div class="FooterNavView settings-onmyteam-link"><a href="/">OnMyTeam.com</a></div>
        </div>
        <div id="second-footer-nav" class="footer-nav second-footer-nav">
          <div class="FooterNavView"><router-link to="/2257">18 U.S.C. 2257 Record-Keeping Requirements Compliance
            Statement</router-link></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StaticFooter"
};
</script>
