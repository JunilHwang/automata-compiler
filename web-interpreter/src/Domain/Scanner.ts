import { Token, opTable, IntNum, VarName } from './TokenDefined';
import { codeContainer } from './CodeContainer';
import { isNum, isVar } from '@/Helper';

export const nextToken = (): Token => {
  const code = codeContainer.getCode();
  const first = codeContainer.getFirst();
  let token: Token;
  let i = 0;
  switch (true) {
    case opTable[first] !== undefined:
      i = 1;
      token = { type: opTable[first], value: 0 };
      break;
    case isNum(first):
      while (isNum(code[i])) { i++; }
      token = { type: IntNum, value: +code.substr(0, i) };
      break;
    default:
      while (isVar(code.substr(0, i))) { i++; }
      token = { type: VarName, value: code.substr(0, i) };
      break;
  }
  codeContainer.setCode(code.substr(i));
  return token;
};
export default { };
