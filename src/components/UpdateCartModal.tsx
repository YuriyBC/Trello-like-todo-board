import * as React from 'react'
import '../styles/ModalComponent.scss'
import ImgClose from '../img/ic-close.png'
import {
    UPDATE_CART,
    ADD_NEW_CART,
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

interface UpdateCartModalInterface {
    submitCartInfo: () => void;
    columnId?: number,
    closeModal: () => void,
    removeCart: () => void,
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
        this.removeCart = this.removeCart.bind(this);
        this.isFormsValid = this.isFormsValid.bind(this);
    }

    componentDidMount () {
        if (this.state.type === UPDATE_CART) {
            const {color, title, text} = this.props.cartInfo;
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
        const colorToSet = this.state.color === color ? '' : color;
        this.setState({
            color: colorToSet
        });
    }

    removeCart () {
        const {id} = this.props.cartInfo
        const {columnId} = this.props
        this.props.removeCart(columnId, id)
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
        let titlePlaceholder: string = "Enter title for the cart";
        let textPlaceholder: string = "Enter text message";

        const availibleColors: availibleColorsInterface = {
            green: GREEN_COLOR,
            yellow: YELLOW_COLOR,
            red: ORANGE_COLOR,
            orange: RED_COLOR,
            blue: BLUE_COLOR
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
                        <p>Title</p>
                        <input placeholder={titlePlaceholder}
                               value={this.state.title}
                               onChange={($ev) => this.setForm($ev, 'title')}
                               required
                               className="form"
                               type="text"/>
                    </div>

                    <div className="modal-field">
                        <p>Text message</p>
                        <textarea onChange={($ev) => this.setForm($ev, 'text')}
                                  value={this.state.text}
                                  className="form"
                                  placeholder={textPlaceholder}/>
                    </div>

                    <div className="modal-field">
                        <p>Choose a color</p>
                        {colorList}
                    </div>

                    <div className="model__container-footer">
                        <div className="model__button button-form__red"
                             onClick={this.removeCart}>
                            Remove
                        </div>
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