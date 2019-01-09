import * as React from 'react';
import imgAdd from '../img/ic-add.png'
import imgClose from '../img/ic-close.png'

interface AddColumnButtonProps {
    toggleEditMode: any,
    addColumn: any,
    formRef: any,
    isAddColumnButtonEditable: boolean
}

let isRendered = false;
export default function AddColumnButton(props: AddColumnButtonProps) {
    const containerClass: string = 'columns-wrapper__add';

    if (!isRendered) {
        document.addEventListener('click', onClickedOutside, true);
        isRendered = true
    }

    function onClickedOutside(ev: any) {
        const ignoredContainer = document.getElementsByClassName(containerClass)[0];
        if (ignoredContainer && !ignoredContainer.contains(ev.target)) {
            props.toggleEditMode(false);
        }

    }

    function columnNameKeypressHandler (ev) {
        if (ev && ev.key === 'Enter') {
            props.addColumn()
        }
    }

    function getAddColumnButton() {
        const isEditable: boolean = props.isAddColumnButtonEditable;
        const defaultMode =
            <div onClick={props.toggleEditMode}
                 className="columns-wrapper__add__initial">
                <img src={imgAdd} alt="add icon"/>
                <span>Add another list</span>
            </div>;

        if (isEditable) {
            setTimeout(() => {
                props.formRef.current.focus()
            })
        }

        const editableMode =
            <div className="columns-wrapper__add__edit">
                <div>
                    <input type="text"
                           ref={props.formRef}
                           onKeyPress={columnNameKeypressHandler}
                           placeholder="Enter list title..."/>
                </div>
                <div>
                    <div className="columns-wrapper__add__edit-button button-form__green"
                         onClick={props.addColumn}>
                        Add list
                    </div>
                    <img className="icon"
                         onClick={props.toggleEditMode}
                         src={imgClose} alt=""/>
                </div>
            </div>;

        return !isEditable ? defaultMode : editableMode;
    }

    return <div className={containerClass}>
        {getAddColumnButton()}
    </div>
}