import React, {Component} from 'react';
import { connect } from 'react-redux'
import './styles/App.scss';
import {HeaderComponent} from "./components/containers/HeaderComponent";
import {ContentComponent} from "./components/containers/ContentComponent";
import {UpdateCardModal} from './components/UpdateCardModal'
import {CustomizeModalComponent} from './components/CustomizeModalComponent'

import {
    addColumn,
    updateColumnTitle,
    addCard,
    updateCard,
    removeCard,
    removeColumn,
    transferDraggbleCard,
    navigateCard,
    setColumnData,
    filterCards
} from './store/actions'

import {
    ColumnModel,
    CardModel
} from './utils/models'

import {
    calculateNextId,
    storage,
    removeFocusFromAllElements,
    throttle,
    generateRandomId
} from './utils/methods'

import {
    UPDATE_CARD,
    ADD_NEW_CARD,
    CARD_MODAL_WINDOW,
    CUSTOMIZE_MODAL_WINDOW,
    STORAGE_HISTORY,
    STORAGE_GLOBAL_STORE,
    ALL_MODALS
} from './utils/constants.js'

interface stateInterface {
    modalCard: {
        isOpened: boolean,
        columnId?: number,
        cardInfo?: object
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
    modalCard: {
        isOpened: false,
        columnId: null,
        cardInfo: null
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

        // cardChanges
        this.openCardForEdit = this.openCardForEdit.bind(this);
        this.toggleCardEditor = this.toggleCardEditor.bind(this);
        this.submitCardInfo = this.submitCardInfo.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.onChangeDrag = this.onChangeDrag.bind(this);
        this.filterCards = this.filterCards.bind(this);

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
        //
        let storageData: any = storage(STORAGE_GLOBAL_STORE);
        let storageHistory: any = storage(STORAGE_HISTORY);
        //
        if (storageData) {
            storageData = JSON.parse(storageData);
            storageData.columnData && this.props.dispatch(setColumnData({
                columnData: storageData.columnData
            }));
            delete storageData.columnData;
            this.setState(storageData)
        }
        //
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

    toggleCardEditor(columnId: number) {
        this.setState({
            modalCard: {
                columnId: columnId,
                isOpened: !this.state.modalCard.isOpened
            }
        });
    }

    closeModal(type: string) {
        let stateField;
        if (type === CARD_MODAL_WINDOW) {
            stateField = 'modalCard'
        } else if (type === CUSTOMIZE_MODAL_WINDOW) {
            stateField = 'modalCustomize'
        } else if (type === ALL_MODALS) {
            this.setState({
                modalCard: {
                    isOpened: false,
                    cardInfo: null
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
                cardInfo: null
            }
        });
    }

    removeCard(columnId: number, cardId: number) {
        this.props.dispatch(removeCard({
            columnId,
            cardId
        }));
        this.closeModal(CARD_MODAL_WINDOW);
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    removeColumn(columnId) {
        this.props.dispatch(removeColumn({columnId}));
        setTimeout(this.memorizeChangesInHistory.bind(this));
    }

    openCardForEdit(columnId: number, cardId: number) {
        const cardToEdit = this.props.columnData.find((el: any) => {
            return el.id === columnId
        }).cards.find((el: any) => {
            return el.id === cardId
        });
        this.setState({
            modalCard: {
                columnId,
                cardInfo: cardToEdit,
                isOpened: !this.state.modalCard.isOpened
            }
        });
    }

    submitCardInfo(val: {
        text: string,
        color: string,
        title: string,
        cardId?: number,
        columnId?: number,
        type: string
    }) {
        if (val.type === UPDATE_CARD) {
            const {columnId, cardId, color, title, text} = val;
            this.props.dispatch(updateCard({
                columnId,
                cardId,
                color,
                title,
                text
            }));
            this.closeModal(CARD_MODAL_WINDOW);
            setTimeout(this.memorizeChangesInHistory.bind(this))
        } else if (val.type === ADD_NEW_CARD) {
            addNewCard.call(this)
        }

        function addNewCard(this: any) {
            const id = generateRandomId()
            const newCard: any = new CardModel({
                color: val.color,
                text: val.text,
                title: val.title,
                columnId: val.columnId,
                id
            });
            this.props.dispatch(addCard({
                columnId: val.columnId,
                card: newCard
            }));
            this.closeModal(CARD_MODAL_WINDOW);
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
        cardId: number
    }, output: {
        columnId: number,
        cardIndex: number,
        cardOldIndex: number
    }) {
        const memorizeCb = this.memorizeChangesInHistory.bind(this);
        this.props.dispatch(transferDraggbleCard({
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
            let allCards = Array.from(document.getElementsByClassName('column-card'));
            let focusedEl: any = allCards.filter(el => el === document.activeElement)[0];
            if (focusedEl) {
                let focusedColumn = Array.from(document.getElementsByClassName('column')).filter(el => el.contains(focusedEl))[0];
                let columnCards = Array.from(focusedColumn.getElementsByClassName('column-card'));

                const THROTTLE_TIME = 200;
                const memorizeCb = this.memorizeChangesInHistory.bind(this);

                throttle(() => {
                    this.props.dispatch(navigateCard({
                        ev,
                        columnId: +focusedEl.dataset.column,
                        target: focusedEl,
                        cardIndex: columnCards.indexOf(focusedEl),
                        memorizeCb}))
                }, THROTTLE_TIME)
            }
        }
    }

    filterCards(ev: any) {
        let history = storage(STORAGE_HISTORY);

        this.props.dispatch(filterCards({
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
        const modalCard = this.state.modalCard.isOpened ?
            <UpdateCardModal columnId={this.state.modalCard.columnId}
                             cardInfo={this.state.modalCard.cardInfo}
                             closeModal={() => this.closeModal(CARD_MODAL_WINDOW)}
                             removeCard={this.removeCard}
                             submitCardInfo={this.submitCardInfo}/> :
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
                                 filterCards={this.filterCards}
                                 showCustomizeModal={this.showCustomizeModal}/>
                <ContentComponent columnTitleChange={this.columnTitleChange}
                                  columnData={this.props.columnData}
                                  addColumn={this.addColumn}
                                  toggleCardEditor={this.toggleCardEditor}
                                  openCardForEdit={this.openCardForEdit}
                                  isAddColumnButtonEditable={this.state.isAddColumnButtonEditable}
                                  onChangeDrag={this.onChangeDrag}
                                  removeColumn={this.removeColumn}/>
                {modalCard}
                {modalCustomize}
            </div>
        );
    }
}


export default connect((state) => ({columnData: state.columnData}))(App)

