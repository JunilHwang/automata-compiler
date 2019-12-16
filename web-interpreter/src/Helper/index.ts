import Vue from 'vue';

export const eventBus = new Vue();
export const isNumChar = (temp: string): boolean => !isNaN(+temp);
export const isVar = (temp: string): boolean => /^[\w\$]+$/.test(temp);
