import * as React from 'react';
import CardComponent from './CardItem'
import Sortable from 'react-sortablejs';


interface CardInterface {
    title: string,
    id: number,
    color: string
    text: string
}

let inputDraggedInfo = {};
let outputDraggedInfo = {};

const CardList = (props: any) => {
        const list = props.cards.map((card: CardInterface, id: number) => {
        return <CardComponent key={id}
                              id={card.id}
                              columnId={props.id}
                              openCardForEdit={() => {
                                  props.openCardForEdit(props.id, card.id)
                              }}
                              title={card.title}
                              color={card.color}
                              text={card.text}/>
    });
    return <Sortable
        options={{
            group: 'shared',
            onStart: (ev, sm) => {
                inputDraggedInfo = {
                    columnId: +props.id,
                    cardId: +ev.item.dataset.id
                }
            },
            onAdd: (ev) => {
                outputDraggedInfo = {
                    columnId: +props.id,
                    cardIndex: +ev.newIndex,
                    cardOldIndex: +ev.oldIndex
                };
                props.onChangeDrag(inputDraggedInfo, outputDraggedInfo)
                inputDraggedInfo = {};
                outputDraggedInfo = {};
            },
            onUpdate: (ev) => {
                outputDraggedInfo = {
                    columnId: +props.id,
                    cardIndex: +ev.newIndex,
                    cardOldIndex: +ev.oldIndex
                };
                props.onChangeDrag(inputDraggedInfo, outputDraggedInfo)
            }
        }}
        onChange={() => {
        }}>
        {list}
    </Sortable>
};

export default CardList;
