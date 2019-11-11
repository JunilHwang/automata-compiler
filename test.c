#include <stdio.h>
#include <stdlib.h>

int main (int argc, char* argv[]) {
  // this is line comment
  int n1 = 1, n2 = 2, n3 = 3, n4;
  float n_5, n_6;
  char _c;
  /*
    this is
    block comment
  */
  printf("n1: %d, n2: %d, n3: %d", n1, n2, n3);
  n4 = (n1 + n2*n3)%10 / 2;
  _c = 'A';
  n_5 = 0.01;
  n_6 = 10.01;

  if (n1 == 1) {
    n1 = 2;
  } else n1 = 3

  switch (n1) {
    case 1:
      n1 = 10;
    break;
    case 2:
      n1 = 20;
    break;
    default :
    break;
  }

  return 0;
}