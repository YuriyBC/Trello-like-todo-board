import * as React from "react";
import imgEdit from '../img/ic-edit.png';
import '../styles/CardComponent.scss';
import {trimString} from '../utils/methods';

interface CardComponentProps {
    title: string,
    text: string,
    openCardForEdit: any,
    color: string,
    id: number,
    columnId: number
}

const CardComponent = (props: CardComponentProps) => {
    const style = props.color ? {"backgroundColor": props.color} : {};

    return <div className="column-card"
                tabIndex={0}
                data-column={props.columnId}
                data-id={props.id}
                onKeyDown={(ev) => {
                    ev.key === 'Enter' && props.openCardForEdit()
                }}
                style={style}>
        <img className="column-card__icon"
             onClick={props.openCardForEdit}
             src={imgEdit}
             alt=""/>
        <span>{props.title}</span>
        <p>{trimString(props.text)}</p>
    </div>
};

export default CardComponent