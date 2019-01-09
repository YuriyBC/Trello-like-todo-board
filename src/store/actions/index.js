export const setColumnData = (payload) => ({
    type: 'SET_COLUMN_DATA',
    payload
});

export const addColumn = (payload) => ({
    type: 'ADD_COLUMN',
    payload
});

export const updateColumnTitle = (payload) => ({
    type: 'UPDATE_COLUMN_TITLE',
    payload
});

export const removeColumn = (payload) => ({
    type: 'REMOVE_COLUMN',
    payload
});

export const addCard = (payload) => ({
    type: 'ADD_CARD',
    columnId: payload.columnId,
    card: payload.card
});

export const updateCard = (payload) => ({
    type: 'UPDATE_CARD',
    payload
});

export const removeCard = (payload) => ({
    type: 'REMOVE_CARD',
    payload
});

export const transferDraggbleCard = (payload) => ({
    type: 'TRANSFER_DRAGGBLE_CARD',
    payload
});

export const navigateCard = (payload) => ({
    type: 'NAVIGATE_CARD',
    payload
});

export const filterCards = (payload) => ({
    type: 'FILTER_CARDS',
    payload
});

