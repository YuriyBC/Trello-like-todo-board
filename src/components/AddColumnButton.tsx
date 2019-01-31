import * as React from "react";
import imgAdd from '../img/ic-add.png'
import imgClose from '../img/ic-close.png'

interface IAddColumnButtonProps {
    toggleEditMode: (b?: boolean) => void,
    addColumn: () => void,
    formRef: React.RefObject<HTMLInputElement>,
    isAddColumnButtonEditable: boolean
}

interface IAddColumnButtonState {
    containerRef: React.RefObject<HTMLInputElement>
}

export class AddColumnButton extends React.Component <any, IAddColumnButtonState> {
    constructor (props: IAddColumnButtonProps) {
        super(props);
        this.state = {
            containerRef: React.createRef()
        };
        this.onClickedOutside = this.onClickedOutside.bind(this);
        this.columnNameKeypressHandler = this.columnNameKeypressHandler.bind(this);
        this.getAddColumnButton = this.getAddColumnButton.bind(this);
        this.getDefaultButton = this.getDefaultButton.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener('click', this.onClickedOutside, true);
    }

    onClickedOutside(ev: any) {
        const ignoredContainer = this.state.containerRef.current;
        if (ignoredContainer && !ignoredContainer.contains(ev.target)) {
            this.props.toggleEditMode(false);
        }
    }

    columnNameKeypressHandler (ev) {
        if (ev && ev.key === 'Enter') {
            this.props.addColumn()
        }
    }

    getDefaultButton () {
        return <div onClick={() => this.props.toggleEditMode()}
                     className="columns-wrapper__add__initial">
                    <img src={imgAdd} alt="add icon"/>
                    <span>Add another list</span>
               </div>;
    }

    getEditableButton () {
        return  <div className="columns-wrapper__add__edit">
                    <div>
                        <input type="text"
                               ref={this.props.formRef}
                               onKeyPress={this.columnNameKeypressHandler}
                               placeholder="Enter list title..."/>
                    </div>
                    <div>
                        <div className="columns-wrapper__add__edit-button button-form__green"
                             onClick={this.props.addColumn}>
                            Add list
                        </div>
                        <img className="icon"
                             onClick={() => this.props.toggleEditMode()}
                             src={imgClose} alt=""/>
                    </div>
                </div>;

    }

    getAddColumnButton() {
        const isEditable: boolean = this.props.isAddColumnButtonEditable;

        if (isEditable) {
            setTimeout(() => {
                if (this.props.formRef.current) this.props.formRef.current.focus()
            })
        }

        return !isEditable ? this.getDefaultButton() : this.getEditableButton();
    }


    render () {
    return <div ref={this.state.containerRef} className="columns-wrapper__add">
        {this.getAddColumnButton()}
    </div>
    }
}