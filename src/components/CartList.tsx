import * as React from 'react';
import CartComponent from './CartItem'
import Sortable from 'react-sortablejs';

let inputDraggedInfo = {};
let outputDraggedInfo = {};

const CartList = (props: any) => {
    const list = props.carts.map((cart: {
        title: string,
        id: number,
        color: string
        text: string}, id: number) => {
        return <CartComponent key={id}
                              id={cart.id}
                              editCart={() => {props.editCart(props.id, cart.id)}}
                              title={cart.title}
                              color={cart.color}
                              text={cart.text} />
    });
    return <Sortable
            options={{
                group: 'shared',
                onStart: (ev, sm) => {
                    inputDraggedInfo = {
                        columnId: +props.id,
                        cartId: +ev.item.dataset.id
                    }
                },
                onAdd: (ev) => {
                    outputDraggedInfo = {
                        columnId: +props.id,
                        cartIndex: +ev.newIndex,
                        cartOldIndex: +ev.oldIndex
                    };
                    props.onChangeDrag(inputDraggedInfo, outputDraggedInfo)
                    inputDraggedInfo = {};
                    outputDraggedInfo = {};
                },
                onUpdate: (ev) => {
                    outputDraggedInfo = {
                        columnId: +props.id,
                        cartIndex: +ev.newIndex,
                        cartOldIndex: +ev.oldIndex
                    };
                    props.onChangeDrag(inputDraggedInfo, outputDraggedInfo)
                }
            }}
            onChange={(order) => {}}>
            {list}
        </Sortable>
};

export default CartList;
