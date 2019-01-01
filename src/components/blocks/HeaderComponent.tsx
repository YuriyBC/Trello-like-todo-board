import * as React from "react";
import '../../styles/HeaderComponent.scss'

interface HeaderComponentProps {
    showCustomizeModal: () => void
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
        return <div className="header">
            <div className="header-search">
                <input type="text"/>
            </div>
            <div className="header-inner">
                <div className="header-logo"></div>
            </div>
            <div className="header-buttons">
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