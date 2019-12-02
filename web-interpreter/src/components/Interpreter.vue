<template>
  <div class="interpreter">
    <textarea class="interpreter__input" cols="80" rows="15" v-model="code" @keydown.enter="parsing" autofocus></textarea>
    <a href="#" class="btn btn__main">테스트코드 삽입</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { statement } from '../Domain/Parser';
import { codeContainer } from '../Domain/CodeContainer';

@Component
export default class Interpreter extends Vue {
  private code: string = '';
  protected parsing({ currentTarget }: any) {
    const lastLine: string = this.code.split('\n').pop() || '';
    codeContainer.setCode(lastLine);
    this.code += statement();
  }
}
</script>
