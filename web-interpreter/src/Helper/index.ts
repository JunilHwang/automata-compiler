import Vue from 'vue';

// Event를 주고받는 Bus를 선언
export const eventBus = new Vue();

// 문자열이 정상적인 숫자형태인지 체크
export const isNumChar = (temp: string): boolean => !isNaN(+temp);

// 문자열이 변수형태인지 정규식으로 체크
export const isVar = (temp: string): boolean => /^[\w\$]+$/.test(temp);
