import * as React from 'react';
import CardComponent from './CardItem'
import Sortable from 'react-sortablejs';
import {storage} from '../utils/methods'

interface ICard {
    title: string,
    id: number,
    color: string
    text: string
}

export class CardList extends React.Component <any, any> {
    constructor (props) {
        super(props);
        this.onDragStart = this.onDragStart.bind(this);
        this.onAddDraggedItem = this.onAddDraggedItem.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }
    onDragStart (event) {
        const inputDraggedInfo = {
            columnId: +this.props.id,
            cardId: +event.item.dataset.id
        };
        storage('inputDraggedInfo', JSON.stringify(inputDraggedInfo));
    }

    onAddDraggedItem (event) {
        const inputDraggedInfo: any = storage('inputDraggedInfo');
        const outputDraggedInfo = {
            columnId: +this.props.id,
            cardIndex: +event.newIndex,
            cardOldIndex: +event.oldIndex
        };
        this.props.onChangeDrag(JSON.parse(inputDraggedInfo), outputDraggedInfo);
        localStorage.removeItem('inputDraggedInfo');
    }

    onUpdate (event) {
        const inputDraggedInfo: any = storage('inputDraggedInfo');
        const outputDraggedInfo = {
                columnId: +this.props.id,
                cardIndex: +event.newIndex,
                cardOldIndex: +event.oldIndex
        };
        this.props.onChangeDrag(JSON.parse(inputDraggedInfo), outputDraggedInfo)
    }

    render () {
        const list = this.props.cards.map((card: ICard, id: number) => {
            return <CardComponent key={id}
                                  id={card.id}
                                  columnId={this.props.id}
                                  openCardForEdit={() => {
                                      this.props.openCardForEdit(this.props.id, card.id)
                                  }}
                                  title={card.title}
                                  color={card.color}
                                  text={card.text}/>
        });

        return <Sortable options={{
                            group: 'shared',
                            onStart: this.onDragStart,
                            onAdd: this.onAddDraggedItem,
                            onUpdate: this.onUpdate
                         }}
                         onChange={() => {}}>
            {list}
        </Sortable>
    }
}

