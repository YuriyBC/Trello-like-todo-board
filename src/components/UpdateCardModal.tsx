import * as React from 'react'
import '../styles/ModalComponent.scss'
import ImgClose from '../img/ic-close.png'
import {
    UPDATE_CARD,
    ADD_NEW_CARD,
    GREEN_COLOR,
    YELLOW_COLOR,
    ORANGE_COLOR,
    RED_COLOR,
    BLUE_COLOR
} from '../utils/constants'


interface IAvailableColors {
    green: string;
    yellow: string;
    red: string;
    orange: string;
    blue: string;

    [propName: string]: string | number | undefined;
}

interface IUpdateCardModal {
    submitCardInfo: () => void;
    columnId?: number,
    closeModal: () => void,
    removeCard: () => void,
    cardInfo?: {
        text: string,
        title: string,
        color: string,
        id: number
    }
}

let titlePlaceholder: string = "Enter title for the card";
let textPlaceholder: string = "Enter text message";

const availableColors: IAvailableColors = {
    green: GREEN_COLOR,
    yellow: YELLOW_COLOR,
    red: ORANGE_COLOR,
    orange: RED_COLOR,
    blue: BLUE_COLOR
};

export class UpdateCardModal extends React.Component <any, any> {
    constructor(props: IUpdateCardModal) {
        super(props);
        this.state = {
            color: '',
            title: '',
            text: '',
            modalRef: React.createRef(),
            type: this.props.cardInfo ? UPDATE_CARD : ADD_NEW_CARD,
            elements: {
                titleForm: {
                    ref: React.createRef(),
                    isValid: true
                },
                messageForm: {
                    ref: React.createRef(),
                    isValid: true
                }
            }
        };
        this.setForm = this.setForm.bind(this);
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.isFormsValid = this.isFormsValid.bind(this);
        this.modalClickHandler = this.modalClickHandler.bind(this);
        this.setFormValidationStyle = this.setFormValidationStyle.bind(this);
        this.getFormStyle = this.getFormStyle.bind(this);
        this.getColorList = this.getColorList.bind(this);
        this.getRemoveButton = this.getRemoveButton.bind(this);
    }

    componentDidMount() {
        if (this.state.type === UPDATE_CARD) {
            const {color, title, text} = this.props.cardInfo;
            this.setState({
                color: color || null,
                title: title || '',
                text: text || ''
            });
        }
    }

    setForm(ev: any, field: string) {
        this.setState({
            [field]: ev.target.value
        });
    }

    setColor(color: any) {
        const colorToSet = this.state.color === color ? '' : color;
        this.setState({
            color: colorToSet
        });
    }

    removeCard() {
        this.props.removeCard(this.props.columnId, this.props.cardInfo.id)
    }

    setFormValidationStyle (element: any, isError: boolean) {
        const state = {...this.state};
        this.state.elements[element.id].isValid = isError;
        this.setState(state)
    }

    isFormsValid() {
        const TIME_STYLES_APPLY = 1000;
        const formElements = [this.state.elements.titleForm.ref.current, this.state.elements.messageForm.ref.current];

        return formElements.every((element) => {
            if (element.required && !element.value.trim()) {
                this.setFormValidationStyle(element, true);
                setTimeout(() => {this.setFormValidationStyle(element, false)}, TIME_STYLES_APPLY);
                return false
            } else {
                return true
            }
        })
    }

    submitResult() {
        const isValid = this.isFormsValid();
        if (isValid) {
            this.props.submitCardInfo({
                color: this.state.color,
                text: this.state.text,
                title: this.state.title,
                cardId: this.props.cardInfo ? this.props.cardInfo.id : null,
                columnId: this.props.columnId,
                type: this.state.type
            })
        }
    }

    modalClickHandler(ev: React.SyntheticEvent) {
        if (ev.target === this.state.modalRef.current) {
            this.props.closeModal()
        }
    }

    getFormStyle (type: string) {
        return this.state.elements[type].isValid ? {"border" : "none"} : {"border": `1px solid ${RED_COLOR}`};
    }

    getColorList () {
        return Object.keys(availableColors).map((i: any, index: number) => {
            let colorClassName = this.state.color === availableColors[i] ? "color-example active" : "color-example diactive"
            if (!this.state.color) colorClassName = "color-example";

            return <div key={index}
                        className={colorClassName}
                        onClick={() => this.setColor(availableColors[i])}
                        style={{background: availableColors[i]}}/>
        });

    }

    getRemoveButton () {
        return this.state.type === UPDATE_CARD ? <div tabIndex={1}
                                                      className="model__button button-form__red"
                                                      onClick={this.removeCard}>
            Remove
        </div> : null;
    }

    render() {


        return <div className="modal"
                    onClick={this.modalClickHandler}
                    ref={this.state.modalRef}>
            <div className="modal__container">
                <div className="modal__container-relative">
                    <img className="modal__close icon"
                         onClick={this.props.closeModal}
                         src={ImgClose}
                         alt=""/>
                    <div className="modal-field">
                        <p>Title</p>
                        <input type="text"
                               className="form"
                               id="titleForm"
                               style={this.getFormStyle("titleForm")}
                               value={this.state.title}
                               placeholder={titlePlaceholder}
                               required
                               ref={this.state.elements.titleForm.ref}
                               onChange={(event) => this.setForm(event, 'title')}/>
                    </div>

                    <div className="modal-field">
                        <p>Text message</p>
                        <textarea className="form"
                                  id="messageForm"
                                  style={this.getFormStyle("messageForm")}
                                  value={this.state.text}
                                  ref={this.state.elements.messageForm.ref}
                                  placeholder={textPlaceholder}
                                  onChange={(event) => this.setForm(event, 'text')}/>
                    </div>

                    <div className="modal-field">
                        <p>Choose a color</p>
                        {this.getColorList()}
                    </div>

                    <div className="model__container-footer">
                        <span>
                          {this.getRemoveButton()}
                        </span>
                        <div tabIndex={1}
                             className="model__button button-form__green"
                             onClick={this.submitResult}>
                            Save
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}