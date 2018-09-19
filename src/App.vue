<template>
  <div>
    <Header v-if="user"/>
    <main id="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import Header from './components/Header/Index'

  export default {
    components: {
      'Header': Header,
    },
    computed: {
      user() {
        return true
      }
    }
  }
</script>

<style lang="scss" src="@/design/css/main.scss"></style>
<style lang="scss" src="@/design/css/colorScheme.scss"></style>
<style lang="scss" src="@/design/fonts/team/team.scss"></style>
