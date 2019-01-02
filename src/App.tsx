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


const initialState = {
    columnList: [{
        id: 0,
        title: 'Stuff To Try (this is a list)',
        carts: []
    }],
    modalCart: {
        isOpened: false,
        columnId: null,
        cartInfo: null
    },
    modalCustomize: {
        isOpened: false
    },
    historyStep: 0
};

class App extends Component <any, any> {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.editCart = this.editCart.bind(this);
    this.addCart = this.addCart.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.columnTitleChange = this.columnTitleChange.bind(this);
    this.submitCartInfo = this.submitCartInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeCart = this.removeCart.bind(this);
    this.showCustomizeModal = this.showCustomizeModal.bind(this);
    this.onChangeDrag = this.onChangeDrag.bind(this);
    this.setStateFromHistory = this.setStateFromHistory.bind(this);
    this.componentWillUnmounted = this.componentWillUnmounted.bind(this);
    this.detectCtrlCombination = this.detectCtrlCombination.bind(this);
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

    componentDidUpdate () {
        this.saveStateInLocalStorage()
    }

    saveStateInLocalStorage (): void {
        const store = this.state.columnList;
        const backgroundColor = document.body.style.backgroundColor;

        storage('columnList', JSON.stringify(store));
        storage('backgroundColor', backgroundColor);
    }

    memorizeEventInHistory (): void {
        let storageData: any = storage('history');
        storageData = JSON.parse(storageData);
        storageData.push(this.state);
        storage('history', JSON.stringify(storageData));

        this.setState({historyStep: storageData.length - 1})
    }

    componentWillUnmounted () {
        let storageData: any = storage('history');
        storageData = JSON.parse(storageData);
        storageData = storageData.slice(0, this.state.historyStep + 1);
        storage('history', JSON.stringify(storageData));
    }

    componentDidMount () {
        if (!storage('history')) {
            storage('history', JSON.stringify([]))
        }

        let storageData: any = storage('columnList');
        let backgroundColor: any = storage('backgroundColor');
        let backgroundImage: any = storage('backgroundImage');
        let storageHistory: any = storage('history');

        if (storageData) {
            this.setState({columnList: JSON.parse(storageData)})
        }
        if (backgroundColor) {
            document.body.style.backgroundColor = backgroundColor
        }
        if (backgroundImage) {
            document.body.style.backgroundImage = `url(${backgroundImage})`
        }
        if (storageHistory) {
            storageHistory = JSON.parse(storageHistory);
            this.setState({historyStep: storageHistory.length - 1});
            if (!storageHistory.length) {this.memorizeEventInHistory()}
        }
        window.addEventListener('beforeunload', this.componentWillUnmounted);
        window.addEventListener('keydown', this.detectCtrlCombination);
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

        setTimeout(this.memorizeEventInHistory.bind(this))
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
        setTimeout(this.memorizeEventInHistory.bind(this).bind(this))
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
        setTimeout(this.memorizeEventInHistory.bind(this))
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
            setTimeout(this.memorizeEventInHistory.bind(this))
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
            setTimeout(this.memorizeEventInHistory.bind(this))
        }
    }

    showCustomizeModal () {
        this.setState({
            modalCustomize: {
                isOpened: true
            }
        })
    }

    onChangeDrag (input: {
        columnId: number,
        cartId: number
    }, output: {
        columnId: number,
        cartIndex: number,
        cartOldIndex: number
    }) {
        if (input.columnId !== output.columnId) {
            let initialState = [...this.state.columnList];
            let draggedCart = [...this.state.columnList].find((el: any) => el.id === input.columnId).carts.find((el: any) => el.id === input.cartId);

            initialState.forEach((el: any) => {
                if (el.id === output.columnId) {
                    const newId = calculateNextId(el.carts);
                    draggedCart.id = newId;
                    draggedCart.columnId = output.columnId;
                    el.carts.splice(output.cartIndex, 0, draggedCart)
                }

                if (el.id === input.columnId) {
                    el.carts.splice(output.cartOldIndex, 1)
                }

            });
            this.setState({columnList: initialState});
            setTimeout(this.memorizeEventInHistory.bind(this))
        }
        if (input.columnId === output.columnId && output.cartIndex !== output.cartOldIndex) {
            let initialState = [...this.state.columnList];

            initialState.forEach((el: any) => {
                if (el.id === input.columnId) {
                   const elToReplace = el.carts.splice(output.cartOldIndex, 1);
                   el.carts.splice(output.cartIndex, 0, elToReplace[0]);
                   console.log( el.carts)
                }
            });
            this.setState({columnList: initialState});
            setTimeout(this.memorizeEventInHistory.bind(this))
        }
    }

    setStateFromHistory (type: string) {
        let historyStep = this.state.historyStep;
        let history: any = storage('history');
        history = JSON.parse(history);

        let step = type === 'prev' ? -1 : 1;

        if (historyStep + step >= 0 && historyStep + step <  history.length) {
            historyStep = historyStep + step
        }

        historyStep === 0 ? this.setState(initialState) : this.setState({...history[historyStep]});
        this.setState({historyStep})
    }

    detectCtrlCombination (ev) {
        if (ev.ctrlKey && ev.keyCode === 90) this.setStateFromHistory('prev');
        if (ev.ctrlKey && ev.keyCode === 89) this.setStateFromHistory('next');
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
        <HeaderComponent setStateFromHistory={this.setStateFromHistory}
                         historyStep={this.state.historyStep}
                         showCustomizeModal={this.showCustomizeModal}/>
        <ContentComponent columnTitleChange={this.columnTitleChange}
                          addCart={this.addCart}
                          editCart={this.editCart}
                          onChangeDrag={this.onChangeDrag}
                          addColumn={this.addColumn}
                          columnList={this.state.columnList}/>
          {modalCart}
          {modalCustomize}
      </div>
    );
  }
}

export default App;
