<template>
  <Layout>
    <template slot="content">
      <SignupForm type="page" />
    </template>
  </Layout>
</template>

<script>
import Layout from "./Layout";

import SignupForm from "@/components/auth/SignupForm";

export default {
  name: "SignUp",

  components: {
    Layout,
    SignupForm
  }
};
</script>
