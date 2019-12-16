<template>
  <div class="interpreter" @click.prevent="$refs.input.focus()">
    <div class="interpreter__container">
      <div class="interpreter__stack" ref="stackContainer">
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
      <div class="interpreter__output" ref="outputContainer">
        <p v-for="(v, k) in outputList" v-html="v" :key="k" />
      </div>
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
  private outputList: string[] = [];
  @Watch('codeList')
  private onCodeListChange() {
    const { stackContainer }: any = this.$refs;
    this.$nextTick(() => {
      stackContainer.scrollTo(0, stackContainer.scrollHeight);
    });
  }
  @Watch('outputList')
  private onOutputListChange() {
    const { outputContainer }: any = this.$refs;
    this.$nextTick(() => {
      outputContainer.scrollTo(0, outputContainer.scrollHeight);
    });
  }
  private created() {
    const { codeList, outputList } = this;
    eventBus.$on('outputAppend', (output: string) => {
      outputList.push(output);
    });
    eventBus.$on('tokenAppend', (token: string) => {
      codeList.push(token);
    });
    eventBus.$on('lineAppend', (indent: string) => {
      codeList.push(`${indent}${this.code}`);
      this.code = '';
      this.errorText = '';
    });
    eventBus.$on('tokenError', (message: string) => {
      this.errorText = message;
    });
  }
  private parsing() {
    codeContainer.setCode(this.code);
    checkState();
  }
}
</script>
