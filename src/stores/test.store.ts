import {observable, action} from 'mobx';

export class TestStore{
  @observable a = 1;

  @action
  addA = () => {
    this.a = this.a + 1;
  }
}