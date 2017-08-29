<template>
  <router-view></router-view>
</template>

<script>
    export default {
      components: {},
      data() {
        return {}
      }
    }
</script>

<style lang="stylus">
  @import "~normalize.css"
  @import "../styles/app.styl"
  body
    background image-url('background.svg') no-repeat center center
    background-size cover
</style>
