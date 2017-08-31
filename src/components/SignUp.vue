<template>
  <div class="container height-100">
    <div class="flex justify-center items-center height-100">
      <div class="flex-none">
        <h1>Sign-up</h1>
        <form v-on:submit.prevent>
          <p v-if="error" class="width-100">{{ error }}</p>
          <div class="margin-bottom-200">
            <input name="username"
                   placeholder="Username"
                   v-model="credentials.username">
            <input type="password"
                   name="password"
                   placeholder="Password"
                   v-model="credentials.password">
            <input type="password"
                   name="password_confirm"
                   placeholder="Confirm password"
                   v-model="credentials.password_confirm">
          </div>
          <div class="vertical-middle">
            <button class="btn secondary-white margin-right-100" v-on:click="submit()">Sign-up</button>
            <router-link :to="{ name: 'login' }">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import Auth from '../services/auth';

  export default {
    data() {
      return {
        credentials: {
          username: '',
          password: '',
          password_confirm: '',
        },
        error: ''
      }
    },
    methods: {
      submit() {
        Auth.signup(this, this.credentials, '/');
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  form
    width 300px

  input
    $color-text = $colors['grey']
    $color-bg = $colors['white']
    display block
    width 100%
    padding 1em
    margin 20px 0
    border-radius 5px
    font-size 18px
    color $color-text
    background $color-bg
    border none
</style>
