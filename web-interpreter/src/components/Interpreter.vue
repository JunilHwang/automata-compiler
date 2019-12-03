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
        autofocus
      />
    </div>
    <a href="#" class="btn btn__main">테스트코드 삽입</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { statement } from '../Domain/Parser';
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
    eventBus.$on('tokenError', message => {      
      this.codeList.push(this.code, message);
      this.code = '';
    });
  }
  
  private parsing({ currentTarget }: any) {
    const { code, codeList } = this;
    const tokens = code.split(";");
    tokens.pop();
    while (tokens[0] !== undefined) {
      const token: string = tokens.pop() || '';
      if (token.length) {
        codeContainer.setCode(token);
        const result: string = statement();
        if (result.length) { 
          setTimeout(() => codeList.push(result));
        }
      }
    }
    codeList.push(code);
    this.code = '';
  }
}
</script>
