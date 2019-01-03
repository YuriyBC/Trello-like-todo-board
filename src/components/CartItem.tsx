import * as React from "react";
import imgEdit from '../img/ic-edit.png';
import '../styles/CartComponent.scss'
import {removeFocusFromAllElements} from '../utils/methods'

interface CartComponentProps {
    title: string,
    text: string,
    openCartForEdit: any,
    color: string,
    id: number,
    navigateCart: any
}

const CartComponent = (props: CartComponentProps) => {
    const style = props.color ? {"backgroundColor": props.color} : {};

    function trimString(string: string) {
        let MAX_LENGTH = 350;
        return string.length > MAX_LENGTH ?
            string.substring(0, MAX_LENGTH) + "..." : string;
    }

    return <div className="column-cart"
                tabIndex={0}
                onKeyDown={props.navigateCart}
                data-id={props.id}
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