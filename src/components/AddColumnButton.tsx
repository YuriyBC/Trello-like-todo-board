import * as React from 'react';
import imgAdd from '../img/ic-add.png'
import imgClose from '../img/ic-close.png'

interface AddColumnButtonProps {
    toggleEditMode: any,
    addColumn: any,
    formRef: any,
    isAddColumnButtonEditable: boolean
}

let i = 0;
export default function AddColumnButton (props: AddColumnButtonProps) {
    const containerClass: string = 'columns-wrapper__add';

    if (!i) {
        document.addEventListener('click', onClickedOutside, true);
        i++
    }

    function getAddColumnButton () {
        const isEditable: boolean = props.isAddColumnButtonEditable;
        const defaultMode =
        <div onClick={props.toggleEditMode}
             className="columns-wrapper__add__initial">
            <img src={imgAdd} alt="add icon"/>
            <span>Add another column</span>
        </div>;

        const editableMode =
        <div className="columns-wrapper__add__edit">
            <div>
                <input type="text"
                       ref={props.formRef}
                       placeholder="Enter a list title"/>
            </div>
            <div>
                <div className="columns-wrapper__add__edit-button button-form__green"
                     onClick={props.addColumn}>
                    Add list</div>
                <img onClick={props.toggleEditMode}
                     src={imgClose} alt=""/>
            </div>
        </div>;

        return !isEditable ? defaultMode : editableMode;
    }

    function onClickedOutside (ev: any) {
        const ignoredContainer = document.getElementsByClassName(containerClass)[0];
        if (ignoredContainer && !ignoredContainer.contains(ev.target)) {
            props.toggleEditMode(false);
        }

    }

    return <div className={containerClass}>
        {getAddColumnButton()}
    </div>
}