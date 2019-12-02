<template>
  <div id="app">
    <h1>웹 인터프리터</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'App',
})
export default class extends Vue {
  protected async created() {
    console.log('test');
  }
}
</script>

<style lang="scss" src="@/assets/scss/common.scss" />
