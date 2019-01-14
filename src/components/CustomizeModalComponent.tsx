import * as React from 'react';
import ImgClose from '../img/ic-close.png'
import '../styles/CustomizeModalComponent.scss'

import {
    GREEN_COLOR,
    YELLOW_COLOR,
    ORANGE_COLOR,
    RED_COLOR,
    BLUE_COLOR
} from '../utils/constants';

interface IAvailableColors {
    green: string;
    yellow: string;
    red: string;
    orange: string;
    blue: string;

    [propName: string]: string | number | undefined;
}

interface IEventTarget extends React.SyntheticEvent {
    target: HTMLInputElement & EventTarget;
}

const availableColors: IAvailableColors = {
    green: GREEN_COLOR,
    yellow: YELLOW_COLOR,
    red: ORANGE_COLOR,
    orange: RED_COLOR,
    blue: BLUE_COLOR
};

interface IState {
   modalRef: any;
   color: string;
   fileInput: any;
   fileName: string;
}

export class CustomizeModalComponent extends React.Component <any, IState> {
    [x: string]: any;
    state: IState;
    constructor(props: {
        backgroundColor: string,
        backgroundImage?: string
    }) {
        super(props);
        this.state = {
            modalRef: React.createRef(),
            color: props.backgroundColor,
            fileInput: React.createRef(),
            fileName: ''
        };
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.modalClickHandler = this.modalClickHandler.bind(this);
        this.updateFilenameTitle = this.updateFilenameTitle.bind(this);
        this.getColorList = this.getColorList.bind(this);
        this.getDeleteImageButton = this.getDeleteImageButton.bind(this);
    }

    setColor(color: any) {
        this.setState({
            color
        });
    }

    submitResult() {
        const fileInput = this.state.fileInput.current;
        if (this.state.color !== this.props.backgroundColor) {
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

    modalClickHandler(event: React.SyntheticEvent) {
        if (event.target === this.state.modalRef.current) {
            this.props.closeModal()
        }
    }

    updateFilenameTitle(event: IEventTarget) {
        if (event.target.files && event.target.files.length) {
            this.setState({
                fileName: event.target.files[0].name
            })
        }

    }

    getColorList () {
        return Object.keys(availableColors).map((i: any, index: number) => {
            let colorClassName = this.state.color && this.state.color.toUpperCase() === availableColors[i]
                ? "color-example active" : "color-example diactive";
            if (!this.state.color) colorClassName = "color-example";

            return <div key={index}
                        className={colorClassName}
                        onClick={() => this.setColor(availableColors[i])}
                        style={{background: availableColors[i]}}/>
        });
    }

    getDeleteImageButton () {
        return this.props.backgroundImage ? <div
            className="model__button button-remove button-form__red"
            onClick={this.removeImage}>
            Delete Image
        </div> : null;
    }

    render() {
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
                        {this.getColorList()}
                    </div>
                    <br/>
                    <div className="modal-field">
                        <p>Upload image</p>
                        <div className="modal-field__uploader">
                            <label htmlFor="inputFile">Browse...</label>
                            <input accept="image/*"
                                   className="modal-form__file"
                                   name="inputFile"
                                   onChange={this.updateFilenameTitle}
                                   ref={this.state.fileInput}
                                   id="inputFile"
                                   type="file"/>
                            <span className="modal-field__fileName">{this.state.fileName}</span>
                        </div>
                    </div>
                    <div className="model__container-footer">
                        <span>
                            {this.getDeleteImageButton()}
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