import React from 'react';
import {} from 'mobx';
import {inject, observer} from 'mobx-react';
import { TestStore } from '../../stores/';
import {Button} from 'antd';

interface TestProps{
  testStore?: TestStore;
}

@inject('testStore')
@observer
export default class Test extends React.Component<TestProps>{
  render(){
    const {testStore} = this.props;
    const {addA}  = testStore!;
    return <div >
      <Button onClick={addA}>click me</Button>
      {testStore!.a}
    </div>
  }
}
