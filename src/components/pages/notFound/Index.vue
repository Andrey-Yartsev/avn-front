<template>
  <div class="error404View">
    <div class="container">
      <h1>Sorry,</h1>
      <h3>this page isn't available</h3>
      <p>
        The link you followed may be broken, or the page may have been removed.
      </p>
      <p>
        <a class="alt" href="/">
          Go back to stars.avn.com
        </a>
      </p>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>
<script>
import Footer from "@/components/footer/Index";

export default {
  components: {
    Footer
  }
};
</script>
