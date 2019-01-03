import * as React from 'react'
import ImgClose from '../img/ic-close.png'
import '../styles/CustomizeModalComponent.scss'

import {
    GREEN_COLOR,
    YELLOW_COLOR,
    ORANGE_COLOR,
    RED_COLOR,
    BLUE_COLOR
} from '../utils/constants.js'

interface availibleColorsInterface {
    green: string;
    yellow: string;
    red: string;
    orange: string;
    blue: string;

    [propName: string]: string | number | undefined;
}


export class CustomizeModalComponent extends React.Component <any, any> {
    constructor(props: {
        backgroundColor: string,
        backgroundImage?: string
    }) {
        super(props);
        this.state = {
            modalRef: React.createRef(),
            color: props.backgroundColor,
            fileInput: React.createRef()
        };
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.modalClickHandler = this.modalClickHandler.bind(this);
    }

    setColor(color: any) {
        this.setState({
            color
        })
    }

    submitResult() {
        const fileInput = this.state.fileInput.current;
        if (this.state.color) {
            this.props.setBackgroundStyle(this.state.color)
        }
        if (fileInput.files && fileInput.files.length) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(fileInput.files[0]);
            fileReader.onload = (e: any) => {
                this.props.setBackgroundStyle(null, e.target.result);
            };
        }
        this.props.closeModal();
    }

    removeImage() {
        this.props.setBackgroundStyle(undefined, null);
    }

    modalClickHandler(ev: React.SyntheticEvent) {
        if (ev.target === this.state.modalRef.current) {
            this.props.closeModal()
        }
    }

    render() {
        const availibleColors: availibleColorsInterface = {
            green: GREEN_COLOR,
            yellow: YELLOW_COLOR,
            red: ORANGE_COLOR,
            orange: RED_COLOR,
            blue: BLUE_COLOR
        };

        let self = this;
        const colorList = Object.keys(availibleColors).map((i: any, index: number) => {
            let colorClassName = self.state.color && self.state.color.toUpperCase() === availibleColors[i] ? "color-example active" : "color-example diactive"
            if (!self.state.color) colorClassName = "color-example";

            return <div key={index}
                        className={colorClassName}
                        onClick={() => self.setColor(availibleColors[i])}
                        style={{background: availibleColors[i]}}/>
        });


        const deleteImageButton = this.props.backgroundImage ? <div
            className="model__button button-remove button-form__red"
            onClick={this.removeImage}>
            Delete Image
        </div> : null;

        return <div className="modal customize"
                    onClick={this.modalClickHandler}
                    ref={this.state.modalRef}>
            <div className="modal__container">
                <div className="modal__container-relative">
                    <img className="modal__close icon"
                         onClick={this.props.closeModal}
                         src={ImgClose}
                         alt=""/>
                    <div className="modal-field">
                        <p>Pick color</p>
                        {colorList}
                    </div>
                    <br/>
                    <div className="modal-field">
                        <p>Upload image</p>
                        <input accept="image/*"
                               className="modal-form__file"
                               name="ImageForm"
                               ref={this.state.fileInput}
                               id="ImageForm"
                               type="file"/>
                    </div>

                    <div className="model__container-footer">
                        <span>
                            {deleteImageButton}
                        </span>
                        <div className="model__button button-form__green"
                             onClick={this.submitResult}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}