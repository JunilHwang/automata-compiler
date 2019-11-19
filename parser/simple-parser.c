#include <stdlib.h>
#include <stdio.h>

char inputStr[100];
int now = 0, size;
void scan (char *str) {
  int i = 0;
  while (str[i]) {
    inputStr[i] = str[i];
    i++;
  }
  size = i;
}
char next () {
  char nextSymbol = now < size ? inputStr[now] : '$';
  now += 1;
  return nextSymbol;
}
void fS(); // S -> aAb
void fA(); // A -> aS | b
void err(int num);

int main (int argc, char *argv[]) {
  scan(argv[1]);
  printf("[Grammer Check] \n");
  printf("S -> aAb \n");
  printf("A -> aS | b \n");
  printf("input : %s \n", inputStr);
  fS();
  printf("---------------------- \n");
  printf("success ! \n");
}
void fS () {
  if (next() != 'a') {
    err(1);
  }
  fA();
  if (next() != 'b') {
    err(2);
  }
}
void fA () {
  switch (next()) {
    case 'a' :
      fS();
    case 'b' :
    break;
    default :
      err(3);
    break;
  }
}
void err (int num) {
  printf("Syntax Error %0d, now %d \n", num, now);
  exit(0);
}