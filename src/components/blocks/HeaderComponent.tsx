import * as React from "react";
import '../../styles/HeaderComponent.scss'
import icDir from '../../img/ic-dir.png'

interface HeaderComponentProps {
    showCustomizeModal: () => void,
    historyStep: number,
    setStateFromHistory: () => void
}

export class HeaderComponent extends React.Component <any, any> {
    constructor (props: HeaderComponentProps) {
        super(props);
        this.state = {
            isDropDownHidden: false
        };
        this.showDropdownContent = this.showDropdownContent.bind(this)
    }

    showDropdownContent () {
        this.setState({
            isDropDownHidden: !this.state.isDropDownHidden
        })
    }

    render () {
        let storageHistory: any = localStorage.getItem('history');
        storageHistory = JSON.parse(storageHistory);
        const isPrevIconActive =  this.props.historyStep > 0;
        const isNextIconActive = storageHistory && this.props.historyStep < storageHistory.length - 1;

        const prevIconClass: string = isPrevIconActive ? 'active' : 'disable';
        const nextIconClass: string = isNextIconActive ? 'active' : 'disable';

        return <div className="header">
            <div className="header-search">
                <input type="text"/>
            </div>
            <div className="header-inner">
                <div className="header-logo"></div>
            </div>
            <div className="header-buttons">
                <div className="header-buttons__arrows">
                    <img onClick={() => isPrevIconActive && this.props.setStateFromHistory('prev')}
                         className={prevIconClass}
                         src={icDir} alt=""/>
                    <img onClick={() => isNextIconActive && this.props.setStateFromHistory('next')}
                         className={nextIconClass}
                         src={icDir} alt=""/>
                </div>
                <div className="header-buttons__add" onClick={this.showDropdownContent}>
                    <div className="header-buttons__add__shadow"></div>
                    <div className="header-buttons__drop-content" style={{"display": !this.state.isDropDownHidden ? 'none' : 'block'}}>
                        <p onClick={this.props.showCustomizeModal}>Customize your trello</p>
                    </div>
                </div>
            </div>
        </div>
    }
}