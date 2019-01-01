import * as React from "react";
import '../styles/ColumnComponent.scss'
import CartComponent from './CartComponent'

interface ColumnComponentProps {
    title: string,
    id: number,
    carts: Array<object>,
    columnTitleChange: any,
    addCart: any,
    editCart: () => void
}

export default class ColumnComponent extends React.Component <any, any> {
    constructor (props: ColumnComponentProps) {
        super(props);
        this.state = {
            isTitleEditMode: false,
            isCartCreationMode: false,
            textAreaRef: React.createRef()
        };
        this.toggleCartCreationMode = this.toggleCartCreationMode.bind(this)
    }

    resizeTextArea (ev: any): void {
        const element: HTMLElement = ev.target;

        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault();
            element.blur();
            return
        }
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";
    }

    componentDidMount () {
        let el: any = document.getElementsByClassName('column-header__title')[0];
        el.style.height = "5px";
        el.style.height = (el.scrollHeight)+"px";
    }

    toggleCartCreationMode () {
        const columnId = this.props.id;
        this.props.addCart(columnId);
    }

    render () {
        const CartList = this.props.carts.map((cart: {
            title: string,
            id: number,
            color: string,
            text: string}, id: number) => {
            return <CartComponent key={id}
                                  editCart={() => {this.props.editCart(this.props.id, cart.id)}}
                                  title={cart.title}
                                  color={cart.color}
                                  text={cart.text} />
        });

        return <div className="column">
            <div className="column-header">
                <textarea onChange={(ev) => this.props.columnTitleChange(ev, this.props.id)}
                          value={this.props.title}
                          onKeyDown={this.resizeTextArea}
                          className="column-header__title"/>
                <span className="column-header__settings">...</span>
            </div>
            <div className="column-carts">
                {CartList}
            </div>
            <div className="column-footer">
                <span onClick={this.toggleCartCreationMode}>Add a cart...</span>
            </div>
        </div>
    }
}