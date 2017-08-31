<template>
  <div class="container">
    <h1>Home</h1>
    <router-link :to="{ name: 'logout' }">Logout</router-link>
  </div>
</template>

<script>
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  .container
    color $color-white
</style>
