<template>
  <div class="container">
    <h1>Dashboard</h1>
    <router-link :to="{ name: 'logout' }">Logout</router-link>

    <hr>

    <form v-on:submit.prevent>
      <input name="todo"
             placeholder="Enter your reminder.."
             v-model="todo"
             required>
      <button class="btn secondary-white" v-on:click="submit()">Add</button>
    </form>

    <ul>
      <li v-for="todo in todos">{{ todo }}</li>
    </ul>

  </div>
</template>

<script>
  import Todos from '../services/todos';

  export default {
    data() {
      return {
        todo: ''
      }
    },
    mounted() {
      const context = this.$root;
      Todos.get(context);
    },
    computed: {
      todos() {
        return this.$store.state.todos
      }
    },
    methods: {
      submit() {
        const context = this.$root;
        if (this.todo.length > 0) {
          Todos.insert(context, this.todo);
        }
        this.todo = '';
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  input
    $color-text = $colors['grey']
    $color-bg = $colors['white']
    display inline-block
    width 500px
    margin 0
    padding .75em
    border-radius 5px
    font-size 18px
    color $color-text
    background $color-bg
    border none
</style>
