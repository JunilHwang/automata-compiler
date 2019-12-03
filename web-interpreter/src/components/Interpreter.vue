<template>
  <div class="interpreter" @click.prevent="$refs.input.focus()">
    <div class="interpreter__container" ref="container">
      <p v-for="(v, k) in codeList"
        :key="k"
        v-html="v.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')"
      />
      <input
        class="interpreter__input"
        v-model="code"
        ref="input"
        @keydown.enter="parsing"
        @keydown.tab.prevent="code += '\t'"
        autofocus
      />
    </div>
    <div class="interpreter__error" v-if="errorText.length" v-html="errorText" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { statement, checkState } from '@/Domain/Parser';
import { codeContainer } from '@/Domain/CodeContainer';
import { Watch } from 'vue-property-decorator';
import { eventBus } from '@/Helper';

@Component
export default class Interpreter extends Vue {
  private codeList: string[] = [];
  private code: string = '';
  private errorText: string = '';
  @Watch('codeList')
  private onCodeListChange() {
    const { container }: any = this.$refs;
    this.$nextTick(() => {
      container.scrollTo(0, container.scrollHeight);
    });
  }
  private created() {
    const { codeList } = this;
    eventBus.$on('tokenError', (message: string) => {
      this.errorText = message;
    });
    eventBus.$on('tokenAppend', (token: string) => {
      codeList.push(token);
    });
    eventBus.$on('lineAppend', (indent: string) => {
      codeList.push(`${indent}${this.code}`);
      this.code = '';
      this.errorText = '';
    });
  }
  private parsing() {
    const { code } = this;
    codeContainer.setCode(code);
    if (!checkState()) {
      const tokens = code.split(';').filter((v: string) => v.trim().length);
      tokens.forEach((token: string) => {
        codeContainer.setCode(token);
        statement();
      });
    }
  }
}
</script>
