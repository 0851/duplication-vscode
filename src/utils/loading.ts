export class Loading {
  num: number = 0;
  start () {
    this.num++;
  }
  end () {
    this.num = this.num - 1 > 0 ? this.num - 1 : 0;
  }
  ing () {
    return this.num > 0;
  }
}