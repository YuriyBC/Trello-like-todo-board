const initialState = [{
    id: 0,
    title: 'Stuff To Try (this is a list)',
    cards: []
}];

const columnData = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COLUMN':
            return [
                ...state,
                action.payload
            ];
        case 'SET_COLUMN_DATA':
            return setColumnData(state, action);
        case 'UPDATE_COLUMN_TITLE':
            return updateColumnTitle(state, action);
        case 'ADD_CARD':
            return addCard(state, action);
        case 'UPDATE_CARD':
            return updateCard(state, action);
        case 'REMOVE_CARD':
            return removeCard(state, action);
        case 'REMOVE_COLUMN':
            return removeColumn(state, action);
        case 'TRANSFER_DRAGGBLE_CARD':
            return transferDraggbleCard(state, action);
        case 'NAVIGATE_CARD':
            return navigateCard(state, action);
        case 'FILTER_CARDS':
            return filterCards(state, action);
        default:
            return state;
    }
};

function updateColumnTitle(state, action) {
    const {ev, id} = action.payload;
    return [...state].map((el) => {
        if (el.id === id) {
            el.title = ev.target.value
        }
        return el
    });
}

function setColumnData(state, action) {
    const {columnData} = action.payload;
    return columnData
}

function addCard(state, action) {
    const currentState = [...state];
    currentState.map((el) => {
        if (el.id === action.columnId) {
            el.cards.push(action.card);
        }
        return el
    });
    return currentState;
}

function updateCard(state, action) {
    const currentState = [...state];
    const {columnId, cardId, color, title, text} = action.payload;
    currentState.map((el) => {
        if (el.id === columnId) {
            el.cards.map((el) => {
                if (el.id === cardId) {
                    el.color = color;
                    el.title = title;
                    el.text = text;
                }
                return el
            })
        }
        return el
    });
    return currentState;
}

function removeCard(state, action) {
    const {columnId, cardId} = action.payload;
    let currentState = [...state];
    let updatedCardList = currentState.find((el) => el.id === columnId).cards.filter((card) => {
        return card.id !== cardId
    });
    currentState.forEach((el) => {
        if (el.id === columnId) {
            el.cards = updatedCardList
        }
    });
    return currentState
}


function removeColumn(state, action) {
    const {columnId} = action.payload;
    let currentState = [...state];
    currentState = currentState.filter(el => el.id !== columnId);
    return currentState
}

function transferDraggbleCard(state, action) {
    const {input, output, memorizeCb} = action.payload;
    let valueToReturn = state;

    if (input.columnId !== output.columnId) {
        let initialState = [...state];
        let draggedCard = [...state].find((el) => el.id === input.columnId).cards.find((el) => el.id === input.cardId);

        initialState.forEach((el) => {
            if (el.id === output.columnId) {
                draggedCard.columnId = output.columnId;
                el.cards.splice(output.cardIndex, 0, draggedCard)
            }

            if (el.id === input.columnId) {
                el.cards.splice(output.cardOldIndex, 1)
            }
        });
        valueToReturn = initialState;
        memorizeCb();
    }

    if (input.columnId === output.columnId && output.cardIndex !== output.cardOldIndex) {
        let initialState = [...state];

        initialState.forEach((el) => {
            if (el.id === input.columnId) {
                const elToReplace = el.cards.splice(output.cardOldIndex, 1);
                el.cards.splice(output.cardIndex, 0, elToReplace[0]);
            }
        });
        valueToReturn = initialState;
        memorizeCb();
    }

    return valueToReturn
}


function navigateCard(state, action) {
    const {ev, columnId, cardIndex, target, memorizeCb} = action.payload;

    const usedKeys = {
        arrowTop: 'ArrowUp',
        arrowDown: 'ArrowDown',
        arrowLeft: 'ArrowLeft',
        arrowRight: 'ArrowRight'
    };
    const verticalDirection = [usedKeys.arrowTop, usedKeys.arrowDown].indexOf(ev.key) !== -1 ? ev.key : null;
    const horizontalDirection = [usedKeys.arrowLeft, usedKeys.arrowRight].indexOf(ev.key) !== -1 ? ev.key : null;

    if (verticalDirection) {
        const currentState = [...state];
        const step = verticalDirection === usedKeys.arrowTop ? -1 : 1;
        const nextEl = verticalDirection === usedKeys.arrowTop ? target.previousSibling : target.nextSibling

        let _maxIndex = currentState[columnId].cards.length - 1,
            _minIndex = 0;


        const indexToReach = cardIndex + step;
        if (_minIndex <= indexToReach && indexToReach <= _maxIndex) {
            let cards = currentState[columnId].cards;

            const replacedItem = cards.splice(indexToReach, 1, cards[cardIndex]);
            cards.splice(cardIndex, 1, replacedItem[0]);

            if (nextEl) nextEl.focus();

            setTimeout(() => {
                memorizeCb()
            });
            return currentState;
        }
    }

    if (horizontalDirection) {
        const currentState = [...state];
        const step = horizontalDirection === usedKeys.arrowLeft ? -1 : 1;
        const nextColumn = horizontalDirection === usedKeys.arrowLeft ? target.offsetParent.previousSibling : target.offsetParent.nextSibling
        let _maxIndex = currentState.length - 1,
            _minIndex = 0;

        const columnToReach = columnId + step;
        if (_minIndex <= columnToReach && columnToReach <= _maxIndex) {
            let cards = currentState[columnId].cards;
            const movedCard = cards.splice(cardIndex, 1)[0];

            let movedCardIndex = currentState[columnToReach].cards.length > cardIndex ? cardIndex : currentState[columnToReach].cards.length;
            currentState[columnToReach].cards.splice(movedCardIndex, 0, movedCard);

            setTimeout(() => {
                const el = nextColumn.getElementsByClassName('column-card')[movedCardIndex];
                if (el) el.focus();
                memorizeCb()
            });
            return currentState
        }
    }
    return state
}

function filterCards(state, action) {
    let {ev, history} = action.payload;
    const valueToFind = ev.target.value.trim();
    let valueToReturn = state;

    history = JSON.parse(history);

    let currentState = history[history.length - 1].columnData;

    if (valueToFind && valueToFind.length > 1) {
        let resultState = currentState.filter((el) => {
            el.cards = el.cards.filter((el) => {
                let elString = el.title + ' ' + el.text;
                return elString.toLowerCase().indexOf(valueToFind.toLowerCase()) !== -1;
            });
            return el.cards.length
        });
        valueToReturn = resultState
    } else {
        valueToReturn = currentState
    }

    return valueToReturn
}


export default columnData;