<template>
  <div class="relative height-100">
    <router-view></router-view>
    <div class="background fixed top-0 bottom-0 left-0 right-0 width-100 height-100 index-neg-10 pointer-events-none"></div>
  </div>
</template>

<script>
  // nothing here..
</script>

<style lang="stylus">
  @import "~normalize.css"
  @import "../styles/app.styl"

  body
    $color-text = $colors['white']
    $color-bg = $colors['blue']
    color $color-text
    background $color-bg
    font-family sans-serif

  .background
    background image-url('background.svg') no-repeat center center
    background-size cover
</style>
