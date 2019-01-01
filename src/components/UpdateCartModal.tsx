import * as React from 'react'
import '../styles/ModalComponent.scss'
import ImgClose from '../img/ic-close.png'
import {
    UPDATE_CART,
    ADD_NEW_CART
} from '../utils/constants.js'


interface availibleColorsInterface {
    green: string;
    yellow: string;
    red: string;
    orange: string;
    blue: string;
    [propName: string]: string | number | undefined;
}

interface UpdateCartModalInterface {
    submitCartInfo: () => void;
    columnId?: number,
    closeModal: () => void,
    cartInfo?: {
        text: string,
        title: string,
        color: string,
        id: number
    }
}

export class UpdateCartModal extends React.Component <any, any> {
    constructor (props: UpdateCartModalInterface) {
        super(props);
        this.state = {
            color: '',
            title: '',
            text: '',
            modalRef: React.createRef(),
            type: this.props.cartInfo ? UPDATE_CART : ADD_NEW_CART
        };
        this.setForm = this.setForm.bind(this);
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.isFormsValid = this.isFormsValid.bind(this);
    }

    componentDidMount () {
        console.log(this.state.type)
        if (this.state.type === UPDATE_CART) {
            const {color, title, text} = this.state.cartInfo;
            this.setState({
                color: color || null,
                title: title || '',
                text: text || ''
            });
        }
    }

    setForm (ev: any, field: string) {
        this.setState({
            [field]: ev.target.value
        });
    }

    setColor (color: any) {
        this.setState({
            color
        });
    }

    isFormsValid () {
        const modalEl = this.state.modalRef.current;
        let elms = modalEl.getElementsByClassName('form');
        const TIME_STYLES_APPLY = 1000;

        return [...elms].every((el) => {
            if (el.required && !el.value.trim()) {
                el.style.border = '1px solid red';
                setTimeout(() => {el.style.border = 'none'}, TIME_STYLES_APPLY);
                return false
            } else {
                return true
            }
        })
    }

    submitResult () {
        const isValid = this.isFormsValid();
        if (isValid) {
          this.props.submitCartInfo({
              color: this.state.color,
              text: this.state.text,
              title: this.state.title,
              cartId: this.props.cartInfo ? this.props.cartInfo.id : null,
              columnId: this.props.columnId,
              type: this.state.type
          })
        }
    }

    render () {
        let titlePlaceholder: string = "Введите заголовок для карточки";
        let textPlaceholder: string = "Введите текст сообщения";

        const availibleColors: availibleColorsInterface = {
            green: "#61BD4F",
            yellow: "#F2D600",
            red: "#EB5A46",
            orange: "#FF9F1A",
            blue: "#0079BF"
        };

        let x = this;
        const colorList = Object.keys(availibleColors).map((i: any, index: number) => {
            let colorClassName = x.state.color === availibleColors[i] ? "color-example active" : "color-example diactive"
            if (!x.state.color) colorClassName = "color-example";

            return <div key={index}
                        className={colorClassName}
                        onClick={() => x.setColor(availibleColors[i])}
                        style={{background: availibleColors[i]}}/>
        });

        return <div className="modal" ref={this.state.modalRef}>
            <div className="modal__container">
                <div className="modal__container-relative">
                    <img className="modal__close icon"
                         onClick={this.props.closeModal}
                         src={ImgClose}
                         alt=""/>
                    <div className="modal-field">
                        <p>Заголовок</p>
                        <input placeholder={titlePlaceholder}
                               value={this.state.title}
                               onChange={($ev) => this.setForm($ev, 'title')}
                               required
                               className="form"
                               type="text"/>
                    </div>

                    <div className="modal-field">
                        <p>Сообщение</p>
                        <textarea onChange={($ev) => this.setForm($ev, 'text')}
                                  value={this.state.text}
                                  className="form"
                                  placeholder={textPlaceholder}/>
                    </div>

                    <div className="modal-field">
                        <p>Выберите цвет</p>
                        {colorList}
                    </div>

                    <div className="model__container-footer">
                        <div className="model__button button-form__green"
                             onClick={this.submitResult}>Сохранить</div>
                    </div>
                </div>
            </div>
        </div>
    }
}