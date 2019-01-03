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
        text: string
    }, id: number) => {
        return <CartComponent key={id}
                              id={cart.id}
                              navigateCart={(ev) => props.navigateCart(ev, props.id, cart.id)}
                              openCartForEdit={() => {
                                  props.openCartForEdit(props.id, cart.id)
                              }}
                              title={cart.title}
                              color={cart.color}
                              text={cart.text}/>
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
                console.log('sdc')
                outputDraggedInfo = {
                    columnId: +props.id,
                    cartIndex: +ev.newIndex,
                    cartOldIndex: +ev.oldIndex
                };
                props.onChangeDrag(inputDraggedInfo, outputDraggedInfo)
            },
            onEnd: (ev) => {
                setTimeout(() => {
                    ev.item.style.display = 'block';
                }, 200)
            },
            onClone: (ev) => {
                ev.item.style.display = 'none';
            }
        }}
        onChange={() => {}}>
        {list}
    </Sortable>
};

export default CartList;
