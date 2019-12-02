<template>
  <div class="interpreter">
    <textarea class="interpreter__input" cols="80" rows="15" v-model="code"></textarea>
    <a href="#" class="btn btn__main">테스트코드 삽입</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Interpreter extends Vue {
  private code: string = '$ ';
}
</script>
