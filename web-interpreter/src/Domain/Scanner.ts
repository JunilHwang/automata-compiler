import {
  Token, opTable, IntNum, VarName, Empty, Comment,
  printKey, programKey, commentKey, TypeInt, TypeFloat,
} from './TokenDefined'; // 사용될 token 정보들을 가져옴
import { codeContainer } from './CodeContainer'; // codeContainer를 가져옴
import { isNumChar, isVar } from '@/Helper'; // 문자열이 number인지, variable인지 체크하는 helper function을 가져옴

export const nextToken = (): Token => {
  const code = codeContainer.getCode();     // 남아있는 code
  const first = codeContainer.getFirst();   // 첫 글자를 가져옴
  const last = code.length;                 // 남아있는 code의 길이
  let token: Token;                         // token에 저장될
  let i = 0;                                // i번 까지의 코드를 삭제
  switch (true) {
    case code.indexOf(commentKey) === 0:    // 주석 체크
      i = last;
      token = { type: opTable[commentKey] }
      break;
    case opTable[first] !== undefined:      // 단일 글자 token 체크
      i = 1;
      token = { type: opTable[first] };
      break;
    case code.indexOf(printKey) === 0:     // print keyword 체크
      i = printKey.length;
      token = { type: opTable[printKey] };
      break;
    case code.indexOf(programKey) === 0:   // program keyword 체크
      i = programKey.length;
      token = { type: opTable[programKey] };
      break;
    case isNumChar(first):                 // number check
      while (isNumChar(code.substr(0, i + 1)) && i < last) { i++; }
      token = { type: IntNum, value: +code.substr(0, i) };
      break;
    case code.indexOf('int') === 0:        // int keyword 체크
      i = 3;
      token = { type: TypeInt };
      break;
    case code.indexOf('float') === 0:      // float keyword 체크
      i = 5;
      token = { type: TypeFloat };
      break;
    case code.length === 0 :               // 빈 문자열 체크
      token = { type: Empty };
      break;
    default:                               // variable을 가져옴
      while (isVar(code.substr(0, i + 1)) && i < last) { i++; }
      token = { type: VarName, value: code.substr(0, i) };
      break;
  }
  // code container의 code를 code[i] ~ code[last]로 교체
  // 예를들어 code -> int a = 10; 일 경우
  // token -> int, i -> 3, code -> a = 10; 으로 저장됨
  codeContainer.setCode(code.substr(i));
  return token;
};
