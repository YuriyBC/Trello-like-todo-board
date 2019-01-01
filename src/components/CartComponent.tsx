import * as React from "react";
import imgEdit from '../img/ic-edit.png';

interface CartComponentProps {
    title: string,
    text: string,
    editCart: any,
    color: string
}

export default function CartComponent (props: CartComponentProps) {
 const style = props.color ? {"backgroundColor": props.color} : {};
 return <div className="column-cart"
             style={style}>
            <img className="column-cart__icon"
                 onClick={props.editCart}
                 src={imgEdit}
                 alt=""/>
            <span>{props.title}</span>
            <p>{props.text}</p>
         </div>
}