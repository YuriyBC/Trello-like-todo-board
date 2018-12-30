import * as React from "react";
import './HeaderComponent.scss'

export function HeaderComponent () {
    return <div className="header">
        <div className="header-search">
            <input type="text"/>
        </div>
        <div className="header-inner">
            <div className="header-logo"></div>
        </div>
        <div className="header-buttons">
            <div className="header-buttons__add"/>
        </div>
    </div>
}