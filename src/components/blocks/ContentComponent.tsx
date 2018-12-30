import * as React from 'react';
// import CartComponent from '../CartComponent'

interface ContentComponentInterface {
    columnList: Array<{
        id: number,
        title: string,
        carts: object
    }>
}

export function ContentComponent (props: ContentComponentInterface) {
    const itemList: any = props.columnList.map(cart => {
        return <div key={cart.id}>{cart.id}</div>
    });
    return itemList
}

