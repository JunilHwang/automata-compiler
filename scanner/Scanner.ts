class Scanner {
  private opTable = {
    '+': 0,              // 연산자
    '-': 1,              // 연산자
    '*': 2,              // 연산자
    '/': 3,              // 연산자
    '=': 4,              // 연산자
    '%': 5,              // 연산자
    ')': 6,              // 괄호 시작
    '(': 7,              // 괄호 끝
    ';': 8,              // 세미콜론(문장의 끝)
    ',': 9,              // int a, b, c 등에서 사용
    '[': 10,             // 배열 시작
    ']': 11,             // 배열 끝
    '{': 12,             // 블록 시작
    '}': 13,             // 블록 끝
    '<': 14,             // 비교 연산자
    '>': 15,             // 비교 연산
    '==': 16,            // 비교 연산
    '<=': 17,            // 비교 연산
    '>=': 18,            // 비교 연산
    '!=': 19,            // 비교 연산
    ':': 20,             // label 표기 혹은 삼항 연산자
    'int': 21,           // 타입
    'char': 22,          // 타입
    'float': 23,         // 타입
    'void': 24,          // 타입
    'return': 25,        // 키워
    '#include': 26,      // 키워
    'if': 27,            // 키워
    'else': 28,          // 키워
    'for': 29,           // 키워
    'while': 30,         // 키워
    'switch': 31,        // 키워
    'case': 32,          // 키워
    'break': 33,         // 키워
    'default': 34,       // 키워
    'number': 35,        // 숫자 상수
    'string': 36,        // 문자 상수
    'line_comment': 37,  // 한줄 주석
    'block_comment': 38, // 블럭 주석
    ' ': 39,             // 공백문자
    '\t': 40,            // 탭문자
    "\r\n": 41,          // 줄바꿈(윈도우)
    "\n": 42,            // 줄바꿈(맥, 리눅스)
    "\r": 43,            // Carriage Return
  }

  // symbol table 정의
  private symbolTable = {}

  // symbolTable의 key의 값. 추가할 때 마다 increment
  private lastSymbolNumber: number = 44

  // 읽어들인 토큰을 나열함
  private tokenList: number[] = []

  // 생성자에서 소스코드를 받은 후 처리
  constructor (code: string) {
    let i: number = 0,               // 반복용 i
        last: number = code.length,  // code의 길이 만큼 반복 
        token = ''                   // token을 기록함

    // this에 있는 tokenList, opTable, symbolTable을 받아옴
    const { tokenList, opTable, symbolTable } = this

    // 반복문을 실행하면서 토큰 기록
    while (i < last) {
      // i의 위치에 있는 문자를 가져옴
      const now = code[i]

      // 만약 i에 따옴표가 들어가면, 이어서 나오는 따옴표를 찾은 후 문자열 토큰으로 기록함
      if (['"', "'"].indexOf(now) !== -1) {
        const next: number = code.indexOf(now, i + 1) + 1
        tokenList.push(opTable['string'])
        i = next; // 다음 i의 위치는 따옴표가 끝나는 위치로 변경
        continue  // 현재 로직 탈출 후 다시 실행
      }

      // 주석 처리
      // i의 위치가 마지막이 아닐 때 진입
      // now와 다음 문자 조합이 주석의 시작일 때 터리
      if (i < last - 1 && ['/*', '//'].indexOf(`${now}${code[i + 1]}`) !== -1) {
        const commentStart: string = `${now}${code[i + 1]}`
        const chk: boolean = commentStart === '/*'
        const commentType: string = chk ? 'block_comment' : 'line_comment'
        const next: number = chk ? code.indexOf('*/', i) + 2 : code.indexOf("\n", i)
        tokenList.push(opTable[commentType])
        i = next + 1;
        continue;
      }

      // 나머지는 if가 아닌 switch로 처리
      // 코드를 작성 후 생각해본 결과, 위의 if문도 switch로 묶어도 무관할듯함.
      // case에서 체크하는 조건이 true일 때 진입
      switch (true) {
        case opTable[token] !== undefined : // token이 opTable에 존재할 경우, 
          tokenList.push(opTable[token])    // tokenList에 기록
          token = ''                        // token 초기화
        break;
        case opTable[now] !== undefined :   // now의 값이 opTable에 존재할 경우,
          if (token.length > 0) {           // 여태까지 기록한 token이 0보다 클때
            switch (true) {
              // token이 숫자 형태일 때 처리
              case /^([0-9]+)$/.test(token) :
              case /^([0-9]+\.[0-9]+)$/.test(token) :
                tokenList.push(opTable['number'])
                token = ''
              break;
              // token이 숫자도 아니라면, 사용자 정의어로 생각하고 처리함
              default :
                // symbolTable에 기록 되지 않은 정의어라면, symbol table에 기록함
                if (symbolTable[token] === undefined) {
                  symbolTable[token] = this.lastSymbolNumber++
                }
                // 그리고 tokenList에 이어 붙임
                tokenList.push(symbolTable[token]);
              break;
            }
          }
          // now를 tokenList에 이어 붙인 후 token 초기화
          tokenList.push(opTable[now]);
          token = '';
        break;
        default :
          token += now
        break;
      }
      // 다음 문자열로 넘어감
      i++;
    }
  }

  result () {
    console.log(this.opTable)              // optable의 값 조회
    console.log(this.symbolTable)          // symbolTable의 값 조회
    console.log(this.tokenList.join(' '))  // tokenList의 값 조회
  }

  getOpTable () {
    return this.opTable
  }

  getSymbolTable () {
    return this.symbolTable
  }

  getTokenList () {
    return this.tokenList
  }
}

export default Scanner