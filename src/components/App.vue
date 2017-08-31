<template>
  <router-view></router-view>
</template>

<script>
</script>

<style lang="stylus">
  @import "~normalize.css"
  @import "../styles/app.styl"
  body
    $color-text = $colors['white']
    $color-bg = $colors['blue']
    color $color-text
    background $color-bg image-url('background.svg') no-repeat center center
    background-size cover
</style>
