export class Loading {
  num: number = 0;
  start () {
    this.num++;
  }
  end () {
    this.num--;
  }
  ing () {
    return this.num > 0;
  }
}