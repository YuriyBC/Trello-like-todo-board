import React, {Component} from 'react';
import { connect } from 'react-redux'
import './styles/App.scss';
import {HeaderComponent} from "./components/containers/HeaderComponent";
import {ContentComponent} from "./components/containers/ContentComponent";
import {UpdateCartModal} from './components/UpdateCartModal'
import {CustomizeModalComponent} from './components/CustomizeModalComponent'

import {
    addColumn,
    updateColumnTitle,
    addCart,
    updateCart,
    removeCart,
    removeColumn,
    transferDraggbleCart,
    navigateCart,
    setColumnData,
    filterCarts
} from './store/actions'

import {
    ColumnModel,
    CartModel
} from './utils/models'

import {
    calculateNextId,
    storage,
    removeFocusFromAllElements,
    throttle,
    generateRandomId
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
    backgroundImage?: any,
    columnData: any,
    dispatch: any
}

const initialState = {
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
        this.openCartForEdit = this.openCartForEdit.bind(this);
        this.toggleCartEditor = this.toggleCartEditor.bind(this);
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

        //styles
        this.setBackgroundStyle = this.setBackgroundStyle.bind(this);
    }

    saveStateInLocalStorage(): void {
        storage(STORAGE_GLOBAL_STORE, JSON.stringify({
            columnData: this.props.columnData,
            ...this.state
        }));
    }

    memorizeChangesInHistory(): void {
        const max_availible_history_length = 25;
        let history: any = storage(STORAGE_HISTORY),
            storageData = JSON.parse(history);

        if (storageData.length <= max_availible_history_length) {
            storageData.push({
                columnData: this.props.columnData,
                ...this.state
            });
        } else {
            storageData.shift();
            storageData.push({
                columnData: this.props.columnData,
                ...this.state
            });
        }
        storage(STORAGE_HISTORY, JSON.stringify(storageData));
        this.setState({historyStep: storageData.length - 1})
    }

    componentWillUnmounted() {
        this.saveStateInLocalStorage();
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
            storageData.columnData && this.props.dispatch(setColumnData({
                columnData: storageData.columnData
            }));
            delete storageData.columnData
            this.setState(storageData);
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

    columnTitleChange = function (this: App, ev: any, id: Number, forceMemoryUpdate?: boolean): void {
        this.props.dispatch(updateColumnTitle({ev, id}));
        if (forceMemoryUpdate) {
            setTimeout(this.memorizeChangesInHistory.bind(this))
        }
    };

    addColumn(title: string) {
        const id = calculateNextId(this.props.columnData);
        const newColumn = new ColumnModel({
            title,
            id
        });
        this.props.dispatch(addColumn(newColumn));
        setTimeout(this.memorizeChangesInHistory.bind(this))
    }

    toggleCartEditor(columnId: number) {
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
        this.props.dispatch(removeCart({
            columnId,
            cartId
        }));
        this.closeModal(CART_MODAL_WINDOW);
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    removeColumn(columnId) {
        this.props.dispatch(removeColumn({columnId}));
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    openCartForEdit(columnId: number, cartId: number) {
        const cartToEdit = this.props.columnData.find((el: any) => {
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
            const {columnId, cartId, color, title, text} = val;
            this.props.dispatch(updateCart({
                columnId,
                cartId,
                color,
                title,
                text
            }));
            this.closeModal(CART_MODAL_WINDOW);
            setTimeout(this.memorizeChangesInHistory.bind(this))
        } else if (val.type === ADD_NEW_CART) {
            addNewCart.call(this)
        }

        function addNewCart(this: any) {
            const id = generateRandomId()
            const newCart: any = new CartModel({
                color: val.color,
                text: val.text,
                title: val.title,
                columnId: val.columnId,
                id
            });
            this.props.dispatch(addCart({
                columnId: val.columnId,
                cart: newCart
            }));
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
        const memorizeCb = this.memorizeChangesInHistory.bind(this);
        this.props.dispatch(transferDraggbleCart({
            input,
            output,
            memorizeCb
        }));
    }

    setStateFromHistory(type: string) {
        let historyStep = this.state.historyStep;
        let history: any = storage(STORAGE_HISTORY);
        history = JSON.parse(history);

        let step = type === 'prev' ? -1 : 1;

        if (historyStep + step >= 0 && historyStep + step < history.length) {
            historyStep = historyStep + step
        }

        const stateToSet = history[historyStep];
        this.props.dispatch(setColumnData({
            columnData: stateToSet.columnData
        }));
        delete stateToSet.columnData;
        this.setState({...stateToSet});
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

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(ev.key) >= 0 && document.activeElement) {
            let allCarts = Array.from(document.getElementsByClassName('column-cart'));
            let focusedEl: any = allCarts.filter(el => el === document.activeElement)[0];
            if (focusedEl) {
                let focusedColumn = Array.from(document.getElementsByClassName('column')).filter(el => el.contains(focusedEl))[0];
                let columnCarts = Array.from(focusedColumn.getElementsByClassName('column-cart'));

                const THROTTLE_TIME = 200;
                const memorizeCb = this.memorizeChangesInHistory.bind(this);

                throttle(() => {
                    this.props.dispatch(navigateCart({
                        ev,
                        columnId: +focusedEl.dataset.column,
                        target: focusedEl,
                        cartIndex: columnCarts.indexOf(focusedEl),
                        memorizeCb}))
                }, THROTTLE_TIME)
            }
        }
    }

    filterCarts(ev: any) {
        let history = storage(STORAGE_HISTORY);

        this.props.dispatch(filterCarts({
            history,
            ev
        }))
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
                                  columnData={this.props.columnData}
                                  addColumn={this.addColumn}
                                  toggleCartEditor={this.toggleCartEditor}
                                  openCartForEdit={this.openCartForEdit}
                                  isAddColumnButtonEditable={this.state.isAddColumnButtonEditable}
                                  onChangeDrag={this.onChangeDrag}
                                  removeColumn={this.removeColumn}/>
                {modalCart}
                {modalCustomize}
            </div>
        );
    }
}


export default connect((state) => ({columnData: state.columnData}))(App)

