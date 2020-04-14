import React from 'react';
import { } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';

interface TestProps {

}

@observer
export default class Test extends React.Component<TestProps>{

  render() {

    return <div >
      test
    </div>
  }
}
