<template>
  <div class="staticPage">
    <div class="container">
      <h1>2257</h1>
      <div class="text">
        <p>OnMyTeam.com is not a producer (primary or secondary) of any and all of the content found on the website.</p>
        <p>OnMyTeam.com is a social network which allows for the uploading, sharing and general viewing of various types
          of content, some of which may be adult in nature.</p>
        <p>OnMyTeam.com abides by the following procedures to ensure compliance:</p>
        <p><strong>Requiring all users to be 18 years of age to upload videos.<br></strong>When uploading, user must
          verify the content; assure he/she is 18 years of age; certify that he/she keeps records of the models in the
          content and that they were over 18 years of age at the time the content was created.</p>
        <p>OnMyTeam.com - Custodian of Records<br>501 Silverside Road St 87, Wilmington, DE 19809</p>
        <p>If you require additional assistance please <router-link to="/contact">contact us</router-link>.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";

export default {
  name: "Record2257Page",

  components: {
    Footer
  }
};
</script>
