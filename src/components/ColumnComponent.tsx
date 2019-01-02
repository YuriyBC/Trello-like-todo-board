import * as React from "react";
import '../styles/ColumnComponent.scss'
import CartList from './CartList'

interface ColumnComponentProps {
    title: string,
    id: number,
    carts: Array<object>,
    columnTitleChange: any,
    addCart: any,
    editCart: () => void,
    onChangeDrag: () => void,
    removeColumn: () => void
}

export default class ColumnComponent extends React.Component <any, any> {
    constructor (props: ColumnComponentProps) {
        super(props);
        this.state = {
            isTitleEditMode: false,
            isCartCreationMode: false,
            textAreaRef: React.createRef(),
            isDropDownOpened: false
        };
        this.toggleCartCreationMode = this.toggleCartCreationMode.bind(this);
        this.toggleColumnDropdown = this.toggleColumnDropdown.bind(this);
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

    toggleColumnDropdown (forseState?: boolean) {
        this.setState({isDropDownOpened: typeof forseState !== 'undefined' ? forseState : !this.state.isDropDownOpened})
    }

    render () {
        const dropdown = this.state.isDropDownOpened ? <div className="column-header__dropdown">
            <p onClick={() => this.props.removeColumn(this.props.id)}>Remove column</p>
        </div> : null;

        return <div className="column"
                    onMouseLeave={() => this.toggleColumnDropdown(false)}>
            <div className="column-header">
                <textarea onChange={(ev) => this.props.columnTitleChange(ev, this.props.id)}
                          value={this.props.title}
                          onKeyDown={this.resizeTextArea}
                          className="column-header__title"/>
                <span className="column-header__settings icon" 
                      onClick={() => this.toggleColumnDropdown()}>...</span>
                    {dropdown}
            </div>
            <div className="column-carts">
                <CartList editCart={this.props.editCart}
                          id={this.props.id}
                          onChangeDrag={this.props.onChangeDrag}
                          navigateCart={this.props.navigateCart}
                          onDropCart={this.props.onDropCart}
                          carts={this.props.carts}/>
            </div>
            <div className="column-footer">
                <span onClick={this.toggleCartCreationMode}>Add a cart...</span>
            </div>
        </div>
    }
}