import * as React from "react";
import '../styles/ColumnComponent.scss'
import {CardList} from './CardList'

interface IColumnComponentProps {
    title: string,
    id: number,
    cards: Array<object>,
    columnTitleChange: any,
    toggleCardEditor: any,
    openCardForEdit: () => void,
    onChangeDrag: () => void,
    removeColumn: () => void
}

export default class ColumnComponent extends React.Component <any, any> {
    constructor(props: IColumnComponentProps) {
        super(props);
        this.state = {
            isTitleEditMode: false,
            isCardCreationMode: false,
            textAreaRef: React.createRef(),
            isDropDownOpened: false
        };
        this.toggleCardCreationMode = this.toggleCardCreationMode.bind(this);
        this.toggleColumnDropdown = this.toggleColumnDropdown.bind(this);
        this.resizeTextArea = this.resizeTextArea.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    resizeTextArea(event?: any): void {
        let element: HTMLElement = this.state.textAreaRef.current;

        if (!event) return;
        if (event && event.key === 'Enter' && !event.shiftKey) {
            element.blur();
            return
        }
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }

    handleBlur(event: React.SyntheticEvent) {
        this.props.columnTitleChange(event, this.props.id, true);
    }

    componentDidMount() {
        let element: HTMLElement = this.state.textAreaRef.current;
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
        setTimeout(() => {
            this.resizeTextArea()
        })
    }

    toggleCardCreationMode() {
        const columnId = this.props.id;
        this.props.toggleCardEditor(columnId);
    }

    toggleColumnDropdown(forseState?: boolean) {
        this.setState({isDropDownOpened: typeof forseState !== 'undefined' ? forseState : !this.state.isDropDownOpened})
    }

    render() {
        const dropdown = this.state.isDropDownOpened ? <div className="column-header__dropdown">
            <p onClick={() => this.props.removeColumn(this.props.id)}>Remove column</p>
        </div> : null;

        return <div className="column"
                    onMouseLeave={() => this.toggleColumnDropdown(false)}>
            <div className="column-header">
                <textarea onChange={(event) => this.props.columnTitleChange(event, this.props.id)}
                          value={this.props.title}
                          ref={this.state.textAreaRef}
                          onBlur={this.handleBlur}
                          onKeyDown={this.resizeTextArea}
                          className="column-header__title"/>
                <span className="column-header__settings icon"
                      onClick={() => this.toggleColumnDropdown()}>...</span>
                {dropdown}
            </div>
            <div className="column-cards">
                <CardList openCardForEdit={this.props.openCardForEdit}
                          id={this.props.id}
                          onChangeDrag={this.props.onChangeDrag}
                          onDropCard={this.props.onDropCard}
                          cards={this.props.cards}/>
            </div>
            <div className="column-footer">
                <span onClick={this.toggleCardCreationMode}>Add a card...</span>
            </div>
        </div>
    }
}