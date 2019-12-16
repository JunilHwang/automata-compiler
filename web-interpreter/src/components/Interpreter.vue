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
  private codeList: string[] = [];    // input area에 출력될 코드
  private code: string = '';          // 한 line의 코드
  private errorText: string = '';     // error에 대한 내용
  private outputList: string[] = [];  // output area에 출력될 코드
  @Watch('codeList') // codeList의 변화를 지켜봄
  private onCodeListChange() {
    const { stackContainer }: any = this.$refs;
    this.$nextTick(() => { // 렌더링 후 스크롤을 맨 밑으로 내림
      stackContainer.scrollTo(0, stackContainer.scrollHeight);
    });
  }
  @Watch('outputList') // outputList의 변화를 지켜봄
  private onOutputListChange() {
    const { outputContainer }: any = this.$refs;
    this.$nextTick(() => { // 렌더링 후 스크롤을 맨 밑으로 내림
      outputContainer.scrollTo(0, outputContainer.scrollHeight);
    });
  }
  private created() { // 태그들이 만들어지는 시점에 실행되는 코드
    const { codeList, outputList } = this;
    // Parser에서 outputAppend를 호출할 경우
    eventBus.$on('outputAppend', (output: string) => {
      outputList.push(output); // output area에 렌더링
    });
    // Parser에서 lineAppend를 호출할 경우
    eventBus.$on('lineAppend', (indent: string) => {
      codeList.push(`${indent}${this.code}`); // intput area에 렌더링 후
      this.code = '';  // 입력중인 코드 초기화
      this.errorText = ''; // 에러 텍스트 초기화
    });
    eventBus.$on('tokenError', (message: string) => {
      this.errorText = message; // 에러 처리
    });
  }
  private parsing() { // Parser를 호출하는 코드
    codeContainer.setCode(this.code); // codeContainer에 현재 입력한 코드를 저장 후
    checkState(); // checkState를 통해서 parser를 호출
  }
}
</script>
