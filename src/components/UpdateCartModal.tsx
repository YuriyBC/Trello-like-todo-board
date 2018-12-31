import * as React from 'react'
import '../styles/ModalComponent.scss'
import ImgClose from '../img/ic-close.png'

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
    closeModal: () => void
}

export class UpdateCartModal extends React.Component <any, any> {
    constructor (props: UpdateCartModalInterface) {
        super(props);
        this.state = {
            color: '',
            title: '',
            text: '',
            modalRef: React.createRef()
        };
        this.setForm = this.setForm.bind(this);
        this.setColor = this.setColor.bind(this);
        this.submitResult = this.submitResult.bind(this);
        this.isFormsValid = this.isFormsValid.bind(this);
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
              columnId: this.props.columnId
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