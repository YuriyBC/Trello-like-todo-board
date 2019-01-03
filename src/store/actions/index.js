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

export const addCart = (payload) => ({
    type: 'ADD_CART',
    columnId: payload.columnId,
    cart: payload.cart
});

export const updateCart = (payload) => ({
    type: 'UPDATE_CART',
    payload
});

export const removeCart = (payload) => ({
    type: 'REMOVE_CART',
    payload
});

export const transferDraggbleCart = (payload) => ({
    type: 'TRANSFER_DRAGGBLE_CART',
    payload
});

export const navigateCart = (payload) => ({
    type: 'NAVIGATE_CART',
    payload
});

export const filterCarts = (payload) => ({
    type: 'FILTER_CARTS',
    payload
});

