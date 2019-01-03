import {calculateNextId} from '../../utils/methods'

const initialState = [{
    id: 0,
    title: 'Stuff To Try (this is a list)',
    carts: []
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
        case 'ADD_CART':
            return addCart(state, action);
        case 'UPDATE_CART':
            return updateCart(state, action);
        case 'REMOVE_CART':
            return removeCart(state, action);
        case 'REMOVE_COLUMN':
            return removeColumn(state, action);
        case 'TRANSFER_DRAGGBLE_CART':
            return transferDraggbleCart(state, action);
        case 'NAVIGATE_CART':
            return navigateCart(state, action);
        case 'FILTER_CARTS':
            return filterCarts(state, action);
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

function addCart(state, action) {
    const currentState = [...state];
    currentState.map((el) => {
        if (el.id === action.columnId) {
            el.carts.push(action.cart);
        }
        return el
    });
    return currentState;
}

function updateCart(state, action) {
    const currentState = [...state];
    const {columnId, cartId, color, title, text} = action.payload;
    currentState.map((el) => {
        if (el.id === columnId) {
            el.carts.map((el) => {
                if (el.id === cartId) {
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

function removeCart(state, action) {
    const {columnId, cartId} = action.payload;
    let currentState = [...state];
    let updatedCartList = currentState.find((el) => el.id === columnId).carts.filter((cart) => {
        return cart.id !== cartId
    });
    currentState.forEach((el) => {
        if (el.id === columnId) {
            el.carts = updatedCartList
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

function transferDraggbleCart(state, action) {
    const {input, output, memorizeCb} = action.payload;
    let valueToReturn = state;

    if (input.columnId !== output.columnId) {
        let initialState = [...state];
        let draggedCart = [...state].find((el) => el.id === input.columnId).carts.find((el) => el.id === input.cartId);

        initialState.forEach((el) => {
            if (el.id === output.columnId) {
                draggedCart.id = calculateNextId(el.carts);
                draggedCart.columnId = output.columnId;
                el.carts.splice(output.cartIndex, 0, draggedCart)
            }

            if (el.id === input.columnId) {
                el.carts.splice(output.cartOldIndex, 1)
            }
        });
        valueToReturn = initialState;
        memorizeCb();
    }

    if (input.columnId === output.columnId && output.cartIndex !== output.cartOldIndex) {
        let initialState = [...state];

        initialState.forEach((el) => {
            if (el.id === input.columnId) {
                const elToReplace = el.carts.splice(output.cartOldIndex, 1);
                el.carts.splice(output.cartIndex, 0, elToReplace[0]);
            }
        });
        valueToReturn = initialState;
        memorizeCb();
    }

    return valueToReturn
}


function navigateCart(state, action) {
    const {ev, columnId, cartId, memorizeCb} = action.payload;

    let valueToReturn;
    const targetEl = ev.target;
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
        const nextEl = verticalDirection === usedKeys.arrowTop ? targetEl.previousSibling : targetEl.nextSibling
        let cartIndex,
            columnIndex,
            _maxIndex,
            _minIndex = 0;

        currentState.forEach((el, index) => {
            if (el.id === columnId) {
                columnIndex = index;
                cartIndex = el.carts.map((el) => el.id).indexOf(cartId);
                _maxIndex = el.carts.length - 1;
            }
        });

        const indexToReach = cartIndex + step;
        if (_minIndex <= indexToReach && indexToReach <= _maxIndex) {
            let carts = currentState[columnIndex].carts;
            const replacedItem = carts.splice(indexToReach, 1, carts[cartIndex]);
            carts.splice(cartIndex, 1, replacedItem[0]);

            valueToReturn = currentState
            setTimeout(() => {
                nextEl.focus();
                memorizeCb()
            });
        }
    }

    if (horizontalDirection) {
        const currentState = [...state];
        const step = horizontalDirection === usedKeys.arrowLeft ? -1 : 1;
        const nextColumn = horizontalDirection === usedKeys.arrowLeft ? ev.target.offsetParent.previousSibling : ev.target.offsetParent.nextSibling
        let cartIndex,
            columnIndex,
            _maxIndex = currentState.length - 1,
            _minIndex = 0;

        currentState.forEach((el, index) => {
            if (el.id === columnId) {
                columnIndex = index;
                cartIndex = el.carts.map((el) => el.id).indexOf(cartId);
            }
        });

        const columnToReach = columnIndex + step;
        if (_minIndex <= columnToReach && columnToReach <= _maxIndex) {
            let carts = currentState[columnIndex].carts;
            const movedCart = carts.splice(cartIndex, 1)[0];

            let movedCartIndex = currentState[columnToReach].carts.length > cartIndex ? cartIndex : currentState[columnToReach].carts.length;
            currentState[columnToReach].carts.splice(movedCartIndex, 0, movedCart);

            setTimeout(() => {
                const el = nextColumn.getElementsByClassName('column-cart')[movedCartIndex];
                if (el) el.focus();
                memorizeCb()
            });
            valueToReturn = currentState
        }
    }
    if (!valueToReturn) {
        return valueToReturn = state
    }
    return valueToReturn
}

function filterCarts(state, action) {
    let {ev, history} = action.payload;
    const valueToFind = ev.target.value.trim();
    let valueToReturn = state;

    history = JSON.parse(history);

    let currentState = history[history.length - 1].columnData;

    if (valueToFind && valueToFind.length > 1) {
        let resultState = currentState.filter((el) => {
            el.carts = el.carts.filter((el) => {
                let elString = el.title + ' ' + el.text;
                return elString.toLowerCase().indexOf(valueToFind.toLowerCase()) !== -1;
            });
            return el.carts.length
        });
        valueToReturn = resultState
    } else {
        valueToReturn = currentState
    }

    return valueToReturn
}


export default columnData;