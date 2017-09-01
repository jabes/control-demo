<template>
  <div class="container height-100">
    <div class="flex justify-center items-center height-100">
      <div class="flex-none">
        <div v-html="icons.logo"></div>
        <form v-on:submit.prevent>
          <p class="block color-red-light"
             v-if="error">{{ error }}</p>
          <div class="margin-bottom-200">
            <p>
              <input type="text"
                     placeholder="Username"
                     v-model="credentials.username">
              <span class="block margin-top-50 color-red-light"
                    v-if="errors.username">{{ errors.username }}</span>
            </p>
            <p>
              <input type="password"
                     placeholder="Password"
                     v-model="credentials.password">
              <span class="block margin-top-50 color-red-light"
                    v-if="errors.password">{{ errors.password }}</span>
            </p>
            <p>
              <input type="password"
                     placeholder="Confirm password"
                     v-model="credentials.password_confirm">
              <span class="block margin-top-50 color-red-light"
                    v-if="errors.password_confirm">{{ errors.password_confirm }}</span>
            </p>
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
        error: '',
        errors: {
          username: '',
          password: '',
          password_confirm: '',
        },
        icons: {
          logo: require('!!svg-inline-loader!../images/logo.svg')
        },
      }
    },
    methods: {
      submit() {
        const redirect = {name: 'dashboard'};
        Auth.signup(this, this.credentials, redirect);
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
    margin 0
    padding 1em
    border-radius 5px
    font-size 18px
    color $color-text
    background $color-bg
    border none
</style>
