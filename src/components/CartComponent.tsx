import * as React from "react";

interface CartComponentProps {
    title: string
}

export default function CartComponent (props:  CartComponentProps) {
 return <div className="column-cart">
            <span>{props.title}</span>
         </div>
}