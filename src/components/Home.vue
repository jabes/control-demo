<template>
  <div class="container">
    <h1>home</h1>
    <router-link :to="{ name: 'login' }">Login</router-link>
  </div>
</template>

<script>
  //  export default {
  //    components: {},
  //    data() {
  //      return {}
  //    }
  //  }
</script>

<style lang="stylus" scoped>
  .container
    color $color-white
</style>
