<template>
  <div class="interpreter" @click.prevent="$refs.input.focus()">
    <div class="interpreter__container" ref="container">
      <p v-for="(v, k) in codeList"
        :key="k"
        v-html="v"
        :class="{ 'is-error': v.indexOf('Error') !== -1 }"
      />
      <input
        class="interpreter__input"
        v-model="code"
        ref="input"
        @keydown.enter="parsing"
        @keydown.tab.prevent="code += '    '"
        autofocus
      />
    </div>
    <a href="#" class="btn btn__main">테스트코드 삽입</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { statement, checkState } from '../Domain/Parser';
import { codeContainer } from '../Domain/CodeContainer';
import { Watch } from 'vue-property-decorator';
import { eventBus } from '../Helper';

@Component
export default class Interpreter extends Vue {
  private codeList: string[] = [];
  private code: string = '';
  @Watch('codeList')
  private onCodeListChange() {
    const { container }: any = this.$refs;
    this.$nextTick(() => {
      container.scrollTo(0, container.scrollHeight);
    });
  }
  private created() {
    eventBus.$on('tokenError', (message: string) => {
      this.codeList.push(this.code, message);
      this.code = '';
    });
    eventBus.$on('tokenAppend', (token: string) => {
      this.codeList.push(token);
    });
  }
  private parsing() {
    const { code, codeList } = this;
    let indent: string = '';
    codeContainer.setCode(code);
    if (!checkState()) {
      const tokens = code.split(';').filter((v: string) => v.trim().length);
      tokens.forEach((token: string) => {
        codeContainer.setCode(token);
        statement();
      });
      indent = '&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    codeList.push(`${indent}${code}`);
    this.code = '';
  }
}
</script>
