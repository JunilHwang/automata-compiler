<template>
  <div id="app">
    <h1 class="app-title" v-html="appTitle" />
    <Interpreter />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Interpreter from '@/components/Interpreter.vue';

const components = { Interpreter };

@Component({ components })
export default class App extends Vue {
  private appTitle: string = '웹 인터프리터';
}
</script>

<style lang="scss" src="@/assets/scss/common.scss" />
