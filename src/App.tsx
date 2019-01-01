import React, { Component } from 'react';
import './styles/App.scss';

import { HeaderComponent } from "./components/blocks/HeaderComponent";
import { ContentComponent } from "./components/blocks/ContentComponent";
import { UpdateCartModal } from './components/UpdateCartModal'
import { CustomizeModalComponent } from './components/CustomizeModalComponent'
import {
    ColumnModel,
    CartModel
} from './utils/models'

import {
    calculateNextId,
    storage
} from './utils/methods'

import {
    UPDATE_CART,
    ADD_NEW_CART,
    CART_MODAL_WINDOW,
    CUSTOMIZE_MODAL_WINDOW
} from './utils/constants.js'

class App extends Component <any, any> {
  constructor(props: object) {
    super(props);
    this.state = {
        columnList: [],
        modalCart: {
            isOpened: false,
            columnId: null,
            cartInfo: null
        },
        modalCustomize: {
            isOpened: false
        }
    };
    this.editCart = this.editCart.bind(this);
    this.addCart = this.addCart.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.columnTitleChange = this.columnTitleChange.bind(this);
    this.submitCartInfo = this.submitCartInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeCart = this.removeCart.bind(this);
    this.showCustomizeModal = this.showCustomizeModal.bind(this);
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
        const backgroundColor = document.body.style.backgroundColor;
        storage('columnList', JSON.stringify(store));
        storage('backgroundColor', backgroundColor);
    }

    componentDidMount () {
        let storageData: any = storage('columnList');
        let backgroundColor: any = storage('backgroundColor');
        let backgroundImage: any = storage('backgroundImage');

        if (storageData) {
            this.setState({columnList: JSON.parse(storageData)})
        }
        if (backgroundColor) {
            document.body.style.backgroundColor = backgroundColor
        }
        if (backgroundImage) {
            document.body.style.backgroundImage = `url(${backgroundImage})`
        }
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

    closeModal (type: string) {
        let stateField;
        if (type === CART_MODAL_WINDOW) {
            stateField = 'modalCart'
        } else {
            stateField = 'modalCustomize'
        }
        this.setState({
            [stateField]: {
                isOpened: !this.state[stateField].isOpened,
                cartInfo: null
            }
        });
    }

    removeCart (columnId: number, cartId: number) {
        let currentState = [...this.state.columnList];
        let updatedCartList = currentState.find((el: any) => el.id === columnId).carts.filter((cart: any) => {
            return cart.id !== cartId
        });
        currentState.forEach((el) => {
            if (el.id === columnId) {
                el.carts = updatedCartList
            }
        });
        this.setState({
            columnList: currentState
        });
        this.closeModal(CART_MODAL_WINDOW);
        setTimeout(() => {this.saveStateInLocalStorage.call(this)})
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
        if (val.type === UPDATE_CART) {
            updateCart.call(this)
        } else if (val.type ===  ADD_NEW_CART) {
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
            this.closeModal(CART_MODAL_WINDOW);
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
            this.closeModal(CART_MODAL_WINDOW);
            setTimeout(() => {this.saveStateInLocalStorage.call(this)})
        }
    }

    showCustomizeModal () {
        this.setState({
            modalCustomize: {
                isOpened: true
            }
        })
    }


  render(): React.ReactNode {
    const modalCart = this.state.modalCart.isOpened ?
        <UpdateCartModal columnId={this.state.modalCart.columnId}
                         cartInfo={this.state.modalCart.cartInfo}
                         closeModal={() => this.closeModal(CART_MODAL_WINDOW)}
                         removeCart={this.removeCart}
                         submitCartInfo={this.submitCartInfo}/> :
        null;

     const modalCustomize = this.state.modalCustomize.isOpened ?
        <CustomizeModalComponent closeModal={() => this.closeModal(CUSTOMIZE_MODAL_WINDOW)}/>
         : null;

    return (
      <div className="App">
        <HeaderComponent showCustomizeModal={this.showCustomizeModal}/>
        <ContentComponent columnTitleChange={this.columnTitleChange}
                          addCart={this.addCart}
                          editCart={this.editCart}
                          addColumn={this.addColumn}
                          columnList={this.state.columnList}/>
          {modalCart}
          {modalCustomize}
      </div>
    );
  }
}

export default App;
