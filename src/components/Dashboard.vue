<template>
  <div>

    <header class="relative margin-bottom-300">
      <div class="absolute index-0 top-0 bottom-0 left-0 right-0 width-100 height-100 bg-white opacity-10"></div>
      <div class="relative index-10 container">
        <div class="flex items-center">
          <div class="flex-auto">
            <h1>Dashboard</h1>
          </div>
          <div class="flex-none">
            <router-link :to="{ name: 'logout' }">Logout</router-link>
          </div>
        </div>
      </div>
    </header>

    <article class="container">

      <form class="flex items-center margin-bottom-300"
            v-on:submit.prevent>
        <div class="flex-auto">
          <input type="text"
                 placeholder="Enter your reminder.."
                 v-model="todo.message">
        </div>
        <div class="flex-none">
          <button class="btn secondary-white margin-left-100" v-on:click="add(todo.message)">Add</button>
        </div>
      </form>

      <ul class="list-style-none margin-0 padding-0">
        <li class="flex items-center margin-bottom-100"
            v-for="todo in todos"
            v-bind:class="{ 'opacity-50': todo.completed }">
          <input type="checkbox"
                 v-bind:checked="todo.completed"
                 v-on:change="toggle(todo.id, todo.completed)">
          <span class="font-size-18 margin-left-100 margin-right-100"
                v-bind:class="{ 'text-decoration-line-through': todo.completed }">{{ todo.message }}</span>
          <button class="trash" v-on:click="remove(todo.id)" v-html="icons.trash"></button>
        </li>
      </ul>

      <p class="font-size-22 opacity-70" v-if="todos.length === 0">You have no reminders.</p>

    </article>

  </div>
</template>

<script>
  import Todos from '../services/todos';

  export default {
    data() {
      return {
        todo: {
          message: '',
        },
        icons: {
          trash: require('!!svg-inline-loader!../images/trash.svg')
        }
      }
    },
    mounted() {
      Todos.get(this.$root);
    },
    computed: {
      todos() {
        return this.$store.state.todos
      }
    },
    methods: {
      add(message) {
        if (message.length > 0) Todos.insert(this.$root, message);
        this.todo.message = '';
      },
      remove(id) {
        Todos.remove(this.$root, id);
      },
      toggle(id, completed) {
        const data = {completed: !completed};
        Todos.update(this.$root, id, data);
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import "../styles/variables.styl"

  input[type=text]
    $color-text = $colors['grey']
    $color-bg = $colors['white']
    display inline-block
    width 100%
    margin 0
    padding .75em
    border-radius 5px
    font-size 18px
    color $color-text
    background $color-bg
    border none

  input[type=checkbox]
    $color-bg = $colors['white']
    display inline-block
    width 30px
    height 30px
    margin 0
    padding 0
    border-radius 5px
    background $color-bg
    border none
    cursor pointer

  .trash
    $color-off = $colors['white']
    $color-on = $colors['red']
    cursor pointer
    border none
    background transparent
    width 20px
    height 20px
    padding 0
    margin 0
    color $color-off
    &:hover
      color $color-on

</style>
