import * as React from "react";
import '../../styles/HeaderComponent.scss'
import icDir from '../../img/ic-dir.png'
import { storage } from '../../utils/methods'

import {
    STORAGE_HISTORY
} from '../../utils/constants.js'

interface IHeaderComponentProps {
    showCustomizeModal: () => void,
    historyStep: number,
    setStateFromHistory: () => void
}

export class HeaderComponent extends React.Component <any, any> {
    constructor(props: IHeaderComponentProps) {
        super(props);
        this.state = {
            isDropDownHidden: false
        };
        this.showDropdownContent = this.showDropdownContent.bind(this);
        this.getClassIcon = this.getClassIcon.bind(this);
        this.setStateFromHistory = this.setStateFromHistory.bind(this);
    }

    showDropdownContent(forceState?: boolean) {
        this.setState({
            isDropDownHidden: typeof forceState !== 'undefined' ? forceState : !this.state.isDropDownHidden
        })
    }

    getClassIcon (type: string) {
        let storageHistory: any = storage(STORAGE_HISTORY);
        storageHistory = JSON.parse(storageHistory);
        const isPrevIconActive = this.props.historyStep > 0;
        const isNextIconActive = storageHistory && this.props.historyStep < storageHistory.length - 1;

        switch (type) {
            case 'prev':
                return isPrevIconActive ? 'active' : 'disable';
            case 'next':
                return isNextIconActive ? 'active' : 'disable';
            default:
                return 'default'
        }
    }

    setStateFromHistory (type: string, currentClass: string) {
        if (type === 'prev' && currentClass === 'active') {
          this.props.setStateFromHistory('prev');
        }
        if (type === 'next' && currentClass === 'active') {
          this.props.setStateFromHistory('next');
        }
    }

    render() {
        const prevIconClass = this.getClassIcon('prev');
        const nextIconClass = this.getClassIcon('next');

        return <div className="header">
            <div className="header-search">
                <input onChange={this.props.filterCards} type="text"/>
            </div>
            <div className="header-inner">
                <a href="/">
                    <div className="header-logo"/>
                </a>
            </div>
            <div className="header-buttons">
                <div className="header-buttons__arrows">
                    <button className={prevIconClass}
                            onClick={() => this.setStateFromHistory('prev', prevIconClass)}>
                        <img tabIndex={-1}
                             src={icDir} alt=""/>
                    </button>
                    <button className={nextIconClass}
                            onClick={() => this.setStateFromHistory('next', nextIconClass)}>
                        <img tabIndex={-1}
                             src={icDir} alt=""/>
                    </button>
                </div>
                <div tabIndex={0}
                     className="header-buttons__add"
                     onClick={() => this.showDropdownContent()}>
                    <div className="header-buttons__add__shadow"/>
                    <div className="header-buttons__drop-content"
                         onMouseLeave={() => {
                             setTimeout(() => {
                                 if (this.state.isDropDownHidden) this.showDropdownContent(false)
                             }, 1000)
                         }}
                         style={{"display": !this.state.isDropDownHidden ? 'none' : 'block'}}>
                        <p onClick={this.props.showCustomizeModal}>Customize your trello</p>
                    </div>
                </div>
            </div>
        </div>
    }
}