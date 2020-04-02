import {TestStore} from './test.store';



export * from './test.store';


export class SingletonStore{
  testStore = new TestStore();
}