import * as React from "react";
import imgEdit from '../img/ic-edit.png';
import '../styles/CartComponent.scss';
import {trimString} from '../utils/methods';

interface CartComponentProps {
    title: string,
    text: string,
    openCartForEdit: any,
    color: string,
    id: number,
    columnId: number
}

const CartComponent = (props: CartComponentProps) => {
    const style = props.color ? {"backgroundColor": props.color} : {};

    return <div className="column-cart"
                tabIndex={0}
                data-column={props.columnId}
                data-id={props.id}
                onKeyDown={(ev) => {
                    ev.key === 'Enter' && props.openCartForEdit()
                }}
                style={style}>
        <img className="column-cart__icon"
             onClick={props.openCartForEdit}
             src={imgEdit}
             alt=""/>
        <span>{props.title}</span>
        <p>{trimString(props.text)}</p>
    </div>
};

export default CartComponent