import React, {Component} from 'react';
import './styles/App.scss';
import {HeaderComponent} from "./components/blocks/HeaderComponent";
import {ContentComponent} from "./components/blocks/ContentComponent";
import {UpdateCartModal} from './components/UpdateCartModal'
import {CustomizeModalComponent} from './components/CustomizeModalComponent'
import {
    ColumnModel,
    CartModel
} from './utils/models'

import {
    calculateNextId,
    storage,
    removeFocusFromAllElements
} from './utils/methods'

import {
    UPDATE_CART,
    ADD_NEW_CART,
    CART_MODAL_WINDOW,
    CUSTOMIZE_MODAL_WINDOW,
    STORAGE_HISTORY,
    STORAGE_GLOBAL_STORE,
    ALL_MODALS
} from './utils/constants.js'

interface stateInterface {
    columnList: any,
    modalCart: {
        isOpened: boolean,
        columnId?: number,
        cartInfo?: object
    },
    modalCustomize: {
        isOpened: boolean
    },
    historyStep: number,
    backgroundColor: string,
    backgroundImage?: any
}

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
    historyStep: 0,
    backgroundColor: '#0079bf',
    backgroundImage: null,
    isAddColumnButtonEditable: false
};

class App extends Component <stateInterface, any> {
    constructor(props) {
        super(props);
        this.state = initialState;

        // cartChanges
        this.editCart = this.editCart.bind(this);
        this.addCart = this.addCart.bind(this);
        this.submitCartInfo = this.submitCartInfo.bind(this);
        this.removeCart = this.removeCart.bind(this);
        this.onChangeDrag = this.onChangeDrag.bind(this);
        this.filterCarts = this.filterCarts.bind(this);

        // columnChanges
        this.addColumn = this.addColumn.bind(this);
        this.columnTitleChange = this.columnTitleChange.bind(this);
        this.removeColumn = this.removeColumn.bind(this);

        // modals
        this.closeModal = this.closeModal.bind(this);
        this.showCustomizeModal = this.showCustomizeModal.bind(this);

        // state control
        this.setStateFromHistory = this.setStateFromHistory.bind(this);
        this.componentWillUnmounted = this.componentWillUnmounted.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);

        // navigation
        this.detectKeyboardCombination = this.detectKeyboardCombination.bind(this);
        this.navigateCart = this.navigateCart.bind(this);

        //styles
        this.setBackgroundStyle = this.setBackgroundStyle.bind(this);
    }

    componentDidUpdate() {
        this.saveStateInLocalStorage()
    }

    columnTitleChange = function (this: App, ev: any, id: Number): void {
        this.setState({
            columnList: this.state.columnList.map((el: { id: Number, title: string }) => {
                if (el.id === id) {
                    el.title = ev.target.value
                }
                return el
            })
        })

    };

    saveStateInLocalStorage(): void {
        storage(STORAGE_GLOBAL_STORE, JSON.stringify(this.state));
    }

    memorizeChangesInHistory(): void {
        const max_availible_history_length = 25;
        let history: any = storage(STORAGE_HISTORY),
            storageData = JSON.parse(history);

        if (storageData.length <= max_availible_history_length) {
            storageData.push(this.state);
        } else {
            storageData.shift();
            storageData.push(this.state);
        }
        storage(STORAGE_HISTORY, JSON.stringify(storageData));
        this.setState({historyStep: storageData.length - 1})
    }

    componentWillUnmounted() {
        let storageData: any = storage(STORAGE_HISTORY);
        storageData = JSON.parse(storageData);
        storageData = storageData.slice(0, this.state.historyStep + 1);
        storage(STORAGE_HISTORY, JSON.stringify(storageData));
    }

    componentDidMount() {
        if (!storage(STORAGE_HISTORY)) {
            storage(STORAGE_HISTORY, JSON.stringify([]))
        }

        let storageData: any = storage(STORAGE_GLOBAL_STORE);
        let storageHistory: any = storage(STORAGE_HISTORY);

        if (storageData) {
            storageData = JSON.parse(storageData);
            this.setState(storageData)
        }

        if (storageHistory) {
            storageHistory = JSON.parse(storageHistory);
            this.setState({historyStep: storageHistory.length - 1});
            if (!storageHistory.length) {
                this.memorizeChangesInHistory()
            }
        }
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('beforeunload', this.componentWillUnmounted);
        window.addEventListener('keydown', this.detectKeyboardCombination);
    }

    addColumn(title: string) {
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

        setTimeout(this.memorizeChangesInHistory.bind(this))
    }

    addCart(columnId: number) {
        this.setState({
            modalCart: {
                columnId: columnId,
                isOpened: !this.state.modalCart.isOpened
            }
        });
    }

    closeModal(type: string) {
        let stateField;
        if (type === CART_MODAL_WINDOW) {
            stateField = 'modalCart'
        } else if (type === CUSTOMIZE_MODAL_WINDOW) {
            stateField = 'modalCustomize'
        } else if (type === ALL_MODALS) {
            this.setState({
                modalCart: {
                    isOpened: false,
                    cartInfo: null
                },
                modalCustomize: {
                    isOpened: false
                }
            });
            return
        }
        this.setState({
            [stateField]: {
                isOpened: !this.state[stateField].isOpened,
                cartInfo: null
            }
        });
    }

    removeCart(columnId: number, cartId: number) {
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
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    removeColumn(columnId) {
        let currentState = [...this.state.columnList];
        currentState = currentState.filter(el => el.id !== columnId);
        this.setState({columnList: currentState});
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    editCart(columnId: number, cartId: number) {
        const cartToEdit = this.state.columnList.find((el: any) => {
            return el.id === columnId
        }).carts.find((el: any) => {
            return el.id === cartId
        });
        this.setState({
            modalCart: {
                columnId,
                cartInfo: cartToEdit,
                isOpened: !this.state.modalCart.isOpened
            }
        });
        setTimeout(this.memorizeChangesInHistory.bind(this))
    }

    submitCartInfo(val: {
        text: string,
        color: string,
        title: string,
        cartId?: number,
        columnId?: number,
        type: string
    }) {
        if (val.type === UPDATE_CART) {
            updateCart.call(this)
        } else if (val.type === ADD_NEW_CART) {
            addNewCart.call(this)
        }

        function updateCart(this: any) {
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
            setTimeout(this.memorizeChangesInHistory.bind(this))
        }

        function addNewCart(this: any) {
            const id = calculateNextId(this.state.columnList.filter((el: { id: number }) => el.id === val.columnId)[0].carts);
            const newCart: any = new CartModel({
                color: val.color,
                text: val.text,
                title: val.title,
                columnId: val.columnId,
                id
            });

            const currentState = [...this.state.columnList];
            currentState.map((el: { id: number, carts: Array<object> }) => {
                if (el.id === val.columnId) {
                    el.carts.push(newCart);
                }
                return el
            });
            this.setState({
                columnList: currentState
            });
            this.closeModal(CART_MODAL_WINDOW);
            setTimeout(this.memorizeChangesInHistory.bind(this))
        }
    }

    showCustomizeModal() {
        this.setState({
            modalCustomize: {
                isOpened: true
            }
        })
    }

    onChangeDrag(input: {
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
                    draggedCart.id = calculateNextId(el.carts);
                    draggedCart.columnId = output.columnId;
                    el.carts.splice(output.cartIndex, 0, draggedCart)
                }

                if (el.id === input.columnId) {
                    el.carts.splice(output.cartOldIndex, 1)
                }

            });
            this.setState({columnList: initialState});
            setTimeout(this.memorizeChangesInHistory.bind(this))
        }
        if (input.columnId === output.columnId && output.cartIndex !== output.cartOldIndex) {
            let initialState = [...this.state.columnList];

            initialState.forEach((el: any) => {
                if (el.id === input.columnId) {
                    const elToReplace = el.carts.splice(output.cartOldIndex, 1);
                    el.carts.splice(output.cartIndex, 0, elToReplace[0]);
                }
            });
            this.setState({columnList: initialState});
            setTimeout(this.memorizeChangesInHistory.bind(this))
        }
    }

    setStateFromHistory(type: string) {
        let historyStep = this.state.historyStep;
        let history: any = storage(STORAGE_HISTORY);
        history = JSON.parse(history);

        let step = type === 'prev' ? -1 : 1;

        if (historyStep + step >= 0 && historyStep + step < history.length) {
            historyStep = historyStep + step
        }

        this.setState({...history[historyStep]});
        this.setState({historyStep})
    }

    detectKeyboardCombination(ev) {
        if (ev.ctrlKey && ev.keyCode === 90) this.setStateFromHistory('prev');
        if (ev.ctrlKey && ev.keyCode === 89) this.setStateFromHistory('next');
        if (ev.ctrlKey && ev.keyCode === 89) this.setStateFromHistory('next');
        if (ev.key === 'Escape') {
            this.closeModal(ALL_MODALS);
            removeFocusFromAllElements();
        }
    }

    navigateCart(ev: any, columnId: number, cartId: number) {
        const targetEl = ev.target;
        const usedKeys = {
            arrowTop: 'ArrowUp',
            arrowDown: 'ArrowDown',
            arrowLeft: 'ArrowLeft',
            arrowRight: 'ArrowRight',
            enter: 'Enter',
        };
        const verticalDirection = [usedKeys.arrowTop, usedKeys.arrowDown].indexOf(ev.key) !== -1 ? ev.key : null;
        const horizontalDirection = [usedKeys.arrowLeft, usedKeys.arrowRight].indexOf(ev.key) !== -1 ? ev.key : null;
        const isEnterClicked = ev.key === usedKeys.enter;

        if (verticalDirection) {
            const currentState = [...this.state.columnList];
            const step = verticalDirection === usedKeys.arrowTop ? -1 : 1;
            const nextEl = verticalDirection === usedKeys.arrowTop ? targetEl.previousSibling : targetEl.nextSibling
            let cartIndex,
                columnIndex,
                _maxIndex,
                _minIndex = 0;

            currentState.map((el: any, index: number) => {
                if (el.id === columnId) {
                    columnIndex = index;
                    cartIndex = el.carts.map((el: any) => el.id).indexOf(cartId);
                    _maxIndex = el.carts.length - 1;
                }
            });

            const indexToReach = cartIndex + step;
            if (_minIndex <= indexToReach && indexToReach <= _maxIndex) {
                let carts = currentState[columnIndex].carts;
                const replacedItem = carts.splice(indexToReach, 1, carts[cartIndex]);
                carts.splice(cartIndex, 1, replacedItem[0]);

                this.setState({columnList: currentState});
                setTimeout(() => {
                    nextEl.focus();
                    this.memorizeChangesInHistory.bind(this);
                });
            }
        }

        if (horizontalDirection) {
            const currentState = [...this.state.columnList];
            const step = horizontalDirection === usedKeys.arrowLeft ? -1 : 1;
            const nextColumn = horizontalDirection === usedKeys.arrowLeft ? ev.target.offsetParent.previousSibling : ev.target.offsetParent.nextSibling
            let cartIndex,
                columnIndex,
                _maxIndex = currentState.length - 1,
                _minIndex = 0;

            currentState.map((el: any, index: number) => {
                if (el.id === columnId) {
                    columnIndex = index;
                    cartIndex = el.carts.map((el: any) => el.id).indexOf(cartId);
                }
            });

            const columnToReach = columnIndex + step;
            if (_minIndex <= columnToReach && columnToReach <= _maxIndex) {
                let carts = currentState[columnIndex].carts;
                const movedCart = carts.splice(cartIndex, 1)[0];

                let movedCartIndex = currentState[columnToReach].carts.length > cartIndex ? cartIndex : currentState[columnToReach].carts.length;
                currentState[columnToReach].carts.splice(movedCartIndex, 0, movedCart);

                this.setState({columnList: currentState});
                setTimeout(() => {
                    const el = nextColumn.getElementsByClassName('column-cart')[movedCartIndex];
                    if (el) el.focus()
                    this.memorizeChangesInHistory.bind(this)
                })
            }
        }

        if (isEnterClicked) this.editCart(columnId, cartId);
    }

    filterCarts(ev: any) {
        const valueToFind = ev.target.value.trim();
        let history: any = storage(STORAGE_HISTORY);
        history = JSON.parse(history);

        let currentState = history[history.length - 1].columnList;

        if (valueToFind && valueToFind.length > 1) {
            let resultState = currentState.filter((el: any) => {
                el.carts = el.carts.filter((el) => {
                    let elString = el.title + ' ' + el.text;
                    return elString.toLowerCase().indexOf(valueToFind.toLowerCase()) !== -1;
                });
                return el.carts.length
            });
            this.setState({columnList: resultState})
        } else {
            this.setState({columnList: currentState})
        }

    }

    setBackgroundStyle(backgroundColor?: string, backgroundImage?: string) {
        if (backgroundColor) this.setState({backgroundColor});
        if (typeof backgroundImage !== 'undefined') {
            this.setState({backgroundImage})
        }
        setTimeout(this.memorizeChangesInHistory.bind(this))
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
            <CustomizeModalComponent setBackgroundStyle={this.setBackgroundStyle}
                                     backgroundColor={this.state.backgroundColor}
                                     backgroundImage={this.state.backgroundImage}
                                     closeModal={() => this.closeModal(CUSTOMIZE_MODAL_WINDOW)}/>
            : null;

        const appStyles: {
            backgroundColor: string,
            backgroundImage: any
        } = {
            backgroundColor: this.state.backgroundColor,
            backgroundImage: this.state.backgroundImage ? `url(${this.state.backgroundImage})` : null
        };

        return (
            <div className="App"
                 style={appStyles}>
                <HeaderComponent setStateFromHistory={this.setStateFromHistory}
                                 historyStep={this.state.historyStep}
                                 filterCarts={this.filterCarts}
                                 showCustomizeModal={this.showCustomizeModal}/>
                <ContentComponent columnTitleChange={this.columnTitleChange}
                                  columnList={this.state.columnList}
                                  addColumn={this.addColumn}
                                  addCart={this.addCart}
                                  editCart={this.editCart}
                                  isAddColumnButtonEditable={this.state.isAddColumnButtonEditable}
                                  onChangeDrag={this.onChangeDrag}
                                  removeColumn={this.removeColumn}
                                  navigateCart={this.navigateCart}/>
                {modalCart}
                {modalCustomize}
            </div>
        );
    }
}

export default App;
