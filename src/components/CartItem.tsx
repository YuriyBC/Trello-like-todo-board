import * as React from "react";
import imgEdit from '../img/ic-edit.png';
import '../styles/CartComponent.scss'

interface CartComponentProps {
    title: string,
    text: string,
    editCart: any,
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
                onClick={(ev: any) => {
                    ev.target.focus()
                }}
                style={style}>
        <img className="column-cart__icon"
             onClick={props.editCart}
             src={imgEdit}
             alt=""/>
        <span>{props.title}</span>
        <p>{trimString(props.text)}</p>
    </div>
};

export default CartComponent