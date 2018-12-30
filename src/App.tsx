import React, { Component } from 'react';
import './App.scss';

import { HeaderComponent } from "./components/blocks/HeaderComponent";
import { ContentComponent } from "./components/blocks/ContentComponent";
import {
    ColumnModel
} from './utils/models'

import {
    calculateNextId
} from './utils/methods'

class App extends Component <any, any> {
  constructor(props: object) {
    super(props);
    this.state = {
        columnList: [{
         id: 0,
         title: 'First columnsdcdjsnjkcdsnjkncsdcc',
         carts: [{
             id: 0,
             title: 'First cart',
             color: '',
             text: ''
         },
         {
             id: 1,
             title: 'Second cart',
             color: '',
             text: ''
         }
         ]
        }]
    };
  }
    columnTitleChange = function (this: App, ev: any, id: Number): void {
        this.setState({
            columnList: this.state.columnList.map((el: {id: Number, title: string}) => {
                if (el.id === id) {
                    el.title = ev.target.value
                }
                return el
            })
        })

    };

    addColumn (title: string) {
        const id = calculateNextId(this.state.columnList);
        const newColumn = new ColumnModel({
            title,
            id
        });
        let currentColumns = [...this.state.columnList];
        currentColumns.push(newColumn);

        this.setState({
            columnList: currentColumns
        })
    }

  render(): React.ReactNode {
    return (
      <div className="App">
        <HeaderComponent/>
        <ContentComponent columnTitleChange={this.columnTitleChange.bind(this)}
                          addColumn={this.addColumn.bind(this)}
                          columnList={this.state.columnList}/>
      </div>
    );
  }
}

export default App;
