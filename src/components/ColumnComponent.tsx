import * as React from "react";
import '../styles/ColumnComponent.scss'
import CartComponent from './CartComponent'

interface ColumnComponentProps {
    title: string,
    id: number,
    carts: Array<object>,
    columnTitleChange: any
}

export default class ColumnComponent extends React.Component <any> {
    constructor (props: ColumnComponentProps) {
        super(props);
        this.state = {
            isTitleEditMode: false
        }
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

    render () {
        const CartList = this.props.carts.map((cart: {title: string}, id: number) => {
            return <CartComponent key={id} title={cart.title}/>
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
                <span>Add a cart</span>
            </div>
        </div>
    }
}