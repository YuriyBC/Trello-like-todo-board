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

import {
    storage
} from '../utils/methods'

interface availibleColorsInterface {
    green: string;
    yellow: string;
    red: string;
    orange: string;
    blue: string;
    [propName: string]: string | number | undefined;
}


export class CustomizeModalComponent extends React.Component <any, any> {
    constructor (props: {}) {
        super(props);
        this.state = {
            modalRef: React.createRef(),
            color: null,
            fileInput: React.createRef(),
            backgroundImage: null
        };
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }

    componentDidMount () {
        function rgb2hex(rgb?: any){
            const color = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (color && color.length === 4) ? "#" +
                ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';
        }

        setTimeout(() => {
            this.setState({
                color: rgb2hex(document.body.style.backgroundColor),
                backgroundImage: storage('backgroundImage')
            })
        })
    }

    setColor (color: any) {
        this.setState({
            color
        })
    }

    submitResult () {
        const fileInput = this.state.fileInput.current;
        if (this.state.color) {
            document.body.style.backgroundColor = this.state.color
            storage('backgroundColor', this.state.color)
        }
        if (fileInput.files && fileInput.files.length) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(fileInput.files[0])
            fileReader.onload = function (e:any) {
                document.body.style.backgroundImage = `url(${e.target.result})`
                storage('backgroundImage', e.target.result)
            };
        }
        this.props.closeModal();
    }

    removeImage () {
        this.setState({
            backgroundImage: null
        });
        document.body.style.backgroundImage = '';
        storage('backgroundImage', '')
    }


    render() {
        const availibleColors: availibleColorsInterface = {
            green: GREEN_COLOR,
            yellow: YELLOW_COLOR,
            red: ORANGE_COLOR,
            orange: RED_COLOR,
            blue: BLUE_COLOR
        };

        let x = this;
        const colorList = Object.keys(availibleColors).map((i: any, index: number) => {
            let colorClassName = x.state.color && x.state.color.toUpperCase() === availibleColors[i] ? "color-example active" : "color-example diactive"
            if (!x.state.color) colorClassName = "color-example";

            return <div key={index}
                        className={colorClassName}
                        onClick={() => x.setColor(availibleColors[i])}
                        style={{background: availibleColors[i]}}/>
        });


        const deleteImageButton = this.state.backgroundImage ? <div
                                        className="model__button button-remove button-form__red"
                                       onClick={this.removeImage}>
                                        Delete Image
                                    </div> : null;

        return <div className="modal customize" ref={this.state.modalRef}>
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
                    <div className="modal-field">
                        <p>
                            <i>or</i>
                        </p>
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