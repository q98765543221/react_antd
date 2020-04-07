import {observable, action} from 'mobx';

export class TestStore{
  @observable a = 1;
  @observable m = observable.map({b: {a: 1}});

  @action
  addA = () => {
    this.a = this.a + 1;
  }

  @action
  changeM = () => {
    const b = this.m.get('b')!;
    b.a = b.a + 1;
  }
}