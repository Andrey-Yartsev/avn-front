<template>
  <div>
    <link href="https://fonts.googleapis.com/css?family=Courgette|Cutive+Mono|Lato|Roboto:300,400,500,700&amp;subset=cyrillic-ext" rel="stylesheet">

    <Login />
  </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Login
  },
  mounted () {
    console.log(process.env)
  }
}
</script>

<style lang="scss" src="@/styles/main.scss"></style>
