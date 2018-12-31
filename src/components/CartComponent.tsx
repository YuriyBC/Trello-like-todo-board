import * as React from "react";
import imgEdit from '../img/ic-edit.png';

interface CartComponentProps {
    title: string,
    text: string,
    editCart: any
}

export default function CartComponent (props: CartComponentProps) {
 return <div className="column-cart">
            <img className="column-cart__icon"
                 onClick={props.editCart}
                 src={imgEdit}
                 alt=""/>
            <span>{props.title}</span>
            <p>{props.text}</p>
         </div>
}