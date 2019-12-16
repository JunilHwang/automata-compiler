import {
  Token,
  Lparen, Rparen,
  IntNum, VarName,
  Assign,
  Plus, Minus, Multi, Divi, Power,
  Print,
  symbolTable,
  varKey, endKey, beginKey, Program, TypeInt, TypeFloat,
  Empty, Comma, Semicolon, Comment,
} from './TokenDefined'; // TokenType, TokenKey, SymbolTable 등을 가져옴
import { nextToken } from './Scanner'; // scanner 함수 가져옴
import { eventBus } from '../Helper';  // 렌더링 시스템에 보낼 함수(이벤트)
import { codeContainer } from './CodeContainer'; // CodeContainer를 가져옴

let stateCounter = 0; // Program State Counter
const NEXT_PROGRAM = stateCounter++;
const NEXT_VAR = stateCounter++;
const NEXT_BEGIN = stateCounter++;
const NEXT_END = stateCounter++;

// 시작은 Program 부터. 즉, 다음 상태로 Program이 선언되어야함
let parserState: number = NEXT_PROGRAM;

// 다음 state에 관한 정보. Program->Var, Var->Begin, Begin->End
const nextStateChecker: any = {
  [varKey]: NEXT_VAR,
  [beginKey]: NEXT_BEGIN,
  [endKey]: NEXT_END,
};

let token: Token;       // scanner로 읽어온 token을 정보를 저장할 변수
const stack: any = [];  // stack 정보

const expression = () => {
  // 곱하기, 나누기 처리 후
  term();

  // 더하기, 빼기를 처리
  while ([Plus, Minus].indexOf(token.type) !== -1) {
    operateCallee(term);
  }
};

const term = () => {
  // 제곱근 처리 후
  pow();

  // 곱하기 나누기 처리
  while ([Multi, Divi].indexOf(token.type) !== -1) {
    operateCallee(pow);
  }
};

const pow = () => {
  // 변수할당, 괄호 연산자, 선언자 처리 후
  factor();

  // 제곱근 처리
  while (token.type === Power) {
    operateCallee(factor);
  }
};

// operate 과정 추상화
const operateCallee = (callback: any) => {
  const operator = token.type;
  token = nextToken();
  callback();
  operate(operator);
};

const factor = () => {
  const { type, value } = token;
  switch (type) {
    // 변수의 값을 stack에 저장하는 과정
    case VarName:
      // SymbolTable에서 변수의 값을 가져온다.
      const symbolValue = symbolTable.get(String(value));

      // 사용하려는 변수가 정의 되지 않았을 때
      if (symbolValue === undefined) {
        errorMessageAppend(`Error: '${value}' is not defined`);
      }

      // 사용하려는 변수가 할당 되지 않았을 때
      if (symbolValue === null) {
        errorMessageAppend(`Error: '${value}' is not assign`);
      }

      // 정상적이라면 stack에 저장
      stack.push(symbolValue);
      break;

    // 숫자는 바로 stack에 저장
    case IntNum:
      stack.push(value);
      break;

    // 왼쪽 괄호가 나왔을 경우엔
    case Lparen:
      // 괄호 사이에 수식 처리 후
      token = nextToken();
      expression();
      // 오른쪽 괄호가 나왔는지 검사
      checkTokenType(Rparen, 'Rparen Error');
      break;
  }

  // 다음 토큰 가져오기
  token = nextToken();
};

// 스택에서 값을 가져온 후 더하기, 빼기, 곱하기, 나누기, 제고급 연산 수행
const operate = (operator: number) => {
  const [d2, d1] = [stack.pop(), stack.pop()];
  if (d1 === undefined) { return; }
  switch (operator) {
    case Plus: stack.push(d1 + d2); break;
    case Minus: stack.push(d1 - d2); break;
    case Multi: stack.push(d1 * d2); break;
    case Divi: stack.push(d1 / d2); break;
    case Power: stack.push(Math.pow(d1, d2)); break;
  }
};

// 변수 선언 처리
const defineVariable = (type: number) => {
  do {
    // 토큰을 가져온 후
    token = nextToken();

    // 변수 이름 형태인지 검사
    checkTokenType(VarName, 'Error: Next token must be \'VarName\'');

    // 이미 변수가 선언 되었을 경우 에러처리
    if (!symbolTable.set(String(token.value), null, type)) {
      errorMessageAppend(`Error: '${token.value}' is already defined Variable`);
    }

    // 다음 토큰이 comma일 경우 위의 과정 다시 반복
    token = nextToken();
  } while (token.type === Comma);
};

// 토큰 타입 검사
const checkTokenType = (tokenType: number, message: string): void => {
  const checked = token.type === tokenType;
  if (!checked) {
    // 원하는 토큰 타입이 아닐 경우 에러 호출
    errorMessageAppend(message);
  }
};

// 위의 과정을 통합한, statement 처리 과정
export const statement = (): void => {
  token = nextToken();
  let indent = '\t'; // statement가 정상이라면 앞에 indent(tab)를 붙여서 출력시킴
  do {
    // 현재 token의 type과 value 저장
    const { type: startTokenType, value: startTokenValue } = token;

    // Statement의 시작(첫번째) token type에 따라 다른 과정 처리
    switch (startTokenType) {
      // Program일 경우
      case Program:
        // 현재 parserState가 NEXT_PROGRAM이 아니라면 에러 처리
        if (parserState !== NEXT_PROGRAM) {
          errorMessageAppend('Error: Next state must be \'Var\'');
        }
        token = nextToken();

        // Program 다음엔 변수 이름 형태가 와야됨
        checkTokenType(VarName, 'Error: Token Type must be \'VarName(word)\'');

        // 다음 State는 Var
        parserState = NEXT_VAR;
        symbolTable.set(String(token.value));
        token = nextToken();
        indent = ''; // Program state앞에는 indent가 필요 없음
        break;

      // 출력을 처리하는 부분
      case Print:
        // Print는 Begin State에서만 사용할 수 있음
        if (parserState !== NEXT_END) {
          errorMessageAppend('Error: "Print" function must use \'Begin\' state');
        }
        token = nextToken();
        expression(); // Print 다음에 오는 token들을 연산 후
        outputAppend(stack.pop()); // Output 영역에 출력함
        break;

      // Statement 시작이 변수 이름일 경우엔 할당문이 필요함
      case VarName:
        // 할당문은 Begin State에서만 사용할 수 있음
        if (parserState !== NEXT_END) {
          errorMessageAppend('Error: Assignment is possible at \'Begin\'');
        }

        // 할당문인지 검사
        token = nextToken();
        checkTokenType(Assign, 'Error: Token Type must be \'Assign(=)\'');

        // 할당 처리
        token = nextToken();
        expression();

        // 선언 되지 않은 변수일 경우 에러 처리
        if (!symbolTable.put(String(startTokenValue), stack.pop())) {
          errorMessageAppend(`Error: '${startTokenValue}' undefined`);
        }
        break;

      // int, float 변수 선언 처리
      case TypeInt:
      case TypeFloat:
        // 변수 선언은 Var state에서만 가능함
        if (parserState !== NEXT_BEGIN) {
          errorMessageAppend('Error: Definition is possible at \'Var\'');
        }
        // 선언 과정은 definedVariable 함수에 위임함
        defineVariable(startTokenType);
        break;
    }
    // Statement 마지막은 세미콜론이나 주석으로 끝나야함
    if ([Semicolon, Comment].indexOf(token.type) === -1) {
      errorMessageAppend('Error: Last token must be \'Semicolon(;)\'');
    }

    // 다음 토큰이 비어있지 않다면, 즉, 세미콜론 이후에 내용이 있다면 위의 과정 반복
    token = nextToken();
  } while (token.type !== Empty);

  // 한 line이 정상적으로 처리되었다면 input 영역에 indent를 추가하여 출력
  lineAppend(indent);
};

// Statement를 처리하기 전, 제일 먼저 state를 처리해야함
export const checkState = (): void => {
  const code = codeContainer.getCode();
  const next = nextStateChecker[code]; // Var, Begin, End 중 하나를 가져옴
  const checked: boolean = next !== undefined;

  // 한 line의 코드가 Var, Begin, End 등과 일치하지 않을 때 statement를 호출함
  if (checked) {
    // 현재 state와 next가 같다면
    if (next === parserState) {
      // state 1 증가. 즉, Var->Begin, Begin->End, End->Program 으로 변경됨
      parserState = (parserState + 1) % stateCounter;
      // 현재 line(code)를 input 영역에 추가
      lineAppend();
      return;
    } else {
      // 일치하지 않으면 에러
      errorMessageAppend(`Error : Next state is not ${code}`);
    }
  }
  statement();
};

// 에러메세지를 받아와서 렌더링 시스템에 출력 함
const errorMessageAppend = (message: string) => {
  eventBus.$emit('tokenError', message);
  throw new Error(message);
};

// 렌더링 시스템의 input 영역에 입력한 코드를 출력함
const lineAppend = (indent: string = '') => eventBus.$emit('lineAppend', indent);

// 렌더링 시스템의 output 영역에 print의 결과를 출력함
const outputAppend = (output: string = '') => eventBus.$emit('outputAppend', output);
