

import {ViewModel} from "./other";

var test: number;

//ez egy komment

class Main {

  private otherModel: ViewModel;

  constructor() {
    this.otherModel = new ViewModel("valami");
  };

  start(): void {
    console.log('start....');
    this.otherModel.valami();
  }

}

let main = new Main();

let g = new ViewModel('aaaa');
let g2 = new ViewModel('bbbb');
