import React, { Component } from 'react';
import './App.scss';

import { HeaderComponent } from "./components/blocks/HeaderComponent";
import { ContentComponent } from "./components/blocks/ContentComponent";


class App extends Component <object, any> {
  constructor(props: object) {
    super(props);
    this.state = {
        columnList: [{
         id: 0,
         title: 'First column',
         carts: {
             id: 0,
             title: 'First cart',
             color: '',
             text: ''
         }
        }]
    }
  }
  render() {
    return (
      <div className="App">
        <HeaderComponent/>
        <ContentComponent columnList={this.state.columnList}/>
      </div>
    );
  }
}

export default App;
