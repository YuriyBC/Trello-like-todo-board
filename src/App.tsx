import React, { Component } from 'react';
import './App.scss';

import { HeaderComponent } from "./components/blocks/HeaderComponent";
import { ContentComponent } from "./components/blocks/ContentComponent";
import { UpdateCartModal } from './components/UpdateCartModal'
import {
    ColumnModel,
    CartModel
} from './utils/models'

import {
    calculateNextId,
    storage
} from './utils/methods'

// [{
//     id: 0,
//     title: 'First columnsdcdjsnjkcdsnjkncsdcc',
//     carts: [{
//         id: 0,
//         title: 'First cart',
//         color: '',
//         text: ''
//     },
//         {
//             id: 1,
//             title: 'Second cart',
//             color: '',
//             text: ''
//         }
//     ]
// }]

class App extends Component <any, any> {
  constructor(props: object) {
    super(props);
    this.state = {
        columnList: [],
        modalCart: {
            isOpened: false,
            columnId: null,
            cartInfo: null
        }
    };
    this.editCart = this.editCart.bind(this);
    this.addCart = this.addCart.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.columnTitleChange = this.columnTitleChange.bind(this);
    this.submitCartInfo = this.submitCartInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
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

    saveStateInLocalStorage (): void {
        const store = this.state.columnList;
        storage('columnList', JSON.stringify(store));
    }

    componentDidMount () {
        let storageData: any = storage('columnList');

        this.setState({
            columnList: JSON.parse(storageData)
        })
    }

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
        });

        setTimeout(() => {this.saveStateInLocalStorage.call(this)})
    }

    addCart (columnId: number) {
        this.setState({
            modalCart: {
                columnId: columnId,
                isOpened: !this.state.modalCart.isOpened
            }
        });
    }

    closeModal () {
        this.setState({
            modalCart: {
                isOpened: !this.state.modalCart.isOpened,
                cartInfo: null
            }
        });
    }

    editCart (columnId: number, cartId: number) {
        const cartToEdit = this.state.columnList.find((el: any) => {
            return el.id === columnId
        }).carts.find((el: any) => {
           return el.id ===  cartId
        });
        this.setState({
            modalCart: {
                columnId,
                cartInfo: cartToEdit,
                isOpened: !this.state.modalCart.isOpened
            }
        });
    }

    submitCartInfo (val: {text: string,
                          color: string,
                          title: string,
                          cartId?: number,
                          columnId?: number,
                          type: string}) {
        if (val.type === 'edit') {
            updateCart.call(this)
        } else {
            addNewCart.call(this)
        }

        function updateCart (this: any) {
            const currentState = [...this.state.columnList];
            currentState.map((el: any) => {
                if (el.id === val.columnId) {
                    el.carts.map((el: any) => {
                        if (el.id === val.cartId) {
                            el.color = val.color;
                            el.title = val.title;
                            el.text = val.text;
                        }
                        return el
                    })
                }
                return el
            });
            this.setState({
                columnList: currentState
            });
            this.closeModal();
            setTimeout(() => {this.saveStateInLocalStorage.call(this)})
        }

        function addNewCart (this: any) {
            const id = calculateNextId(this.state.columnList.filter((el: {id: number}) => el.id === val.columnId)[0].carts);
            const newCart: any = new CartModel({
                color: val.color,
                text: val.text,
                title: val.title,
                columnId: val.columnId,
                id
            });

            const currentState =  [...this.state.columnList];
            currentState.map((el: {id: number, carts: Array<object>}) => {
                if (el.id === val.columnId) {
                    el.carts.push(newCart);
                }
                return el
            });
            this.setState({
                columnList: currentState
            });
            this.closeModal();
            setTimeout(() => {this.saveStateInLocalStorage.call(this)})
        }
    }


  render(): React.ReactNode {
    const modalCart = this.state.modalCart.isOpened ?
        <UpdateCartModal columnId={this.state.modalCart.columnId}
                         cartInfo={this.state.modalCart.cartInfo}
                         closeModal={this.closeModal}
                         submitCartInfo={this.submitCartInfo}/> :
        null;

    return (
      <div className="App">
        <HeaderComponent/>
        <ContentComponent columnTitleChange={this.columnTitleChange}
                          addCart={this.addCart}
                          editCart={this.editCart}
                          addColumn={this.addColumn}
                          columnList={this.state.columnList}/>
          {modalCart}
      </div>
    );
  }
}

export default App;
