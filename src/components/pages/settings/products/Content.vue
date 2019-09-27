<template>
  <div class="rounded-container">
    <div class="products">
      <Products />
    </div>
  </div>
</template>

<script>
// import Loader from "@/components/common/Loader";
import Products from "./Products";

export default {
  name: "ProductsSettingsContent",

  components: {
    Products
  }
};
</script>
