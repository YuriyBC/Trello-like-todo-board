import * as React from 'react';
import ColumnComponent from '../ColumnComponent'
import AddColumnButton from '../AddColumnButton'

interface ContentComponentInterface {
    columnList: Array<{
        id: number,
        title: string,
        carts: Array<object>
    }>,
    editCart: () => void,
    addCart: () => void,
    addColumn: () => void,
    columnTitleChange: any
    onChangeDrag: () => void,
}

export class ContentComponent  extends React.Component <any, any> {
    constructor (props: ContentComponentInterface) {
        super(props);
        this.state = {
            isAddColumnButtonEditable: false,
            formRef: React.createRef()
        };
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.addColumn = this.addColumn.bind(this)
    }

    toggleEditMode (forceValue?: boolean): void {
        this.setState({
            isAddColumnButtonEditable: typeof forceValue === 'boolean' ? forceValue : !this.state.isAddColumnButtonEditable
        })
    }

    addColumn () {
        const columnTitle = this.state.formRef.current.value;
        if (columnTitle) {
            this.props.addColumn(this.state.formRef.current.value);
            this.state.formRef.current.value = ''
        } else {
            const RETURN_COLOR_TIME = 500;
            const formEl = this.state.formRef.current;
            const initialColor = this.state.formRef.current.style.boxShadow;

            formEl.style.boxShadow = 'inset 0 0 0 2px red';
            setTimeout(() => {formEl.style.boxShadow = initialColor}, RETURN_COLOR_TIME)
        }
    }

    render () {
        const columnList: any = this.props.columnList.map((column: {
            title: string,
            carts: Array<object>,
            id: number
        }) => {
            return <ColumnComponent title={column.title}
                                    editCart={this.props.editCart}
                                    carts={column.carts}
                                    addCart={this.props.addCart}
                                    columnTitleChange={this.props.columnTitleChange}
                                    key={column.id}
                                    onChangeDrag={this.props.onChangeDrag}
                                    id={column.id}/>
        });

        return <div className="columns-wrapper">
            {columnList}
            <AddColumnButton toggleEditMode={this.toggleEditMode}
                             isAddColumnButtonEditable={this.state.isAddColumnButtonEditable}
                             formRef={this.state.formRef}
                             addColumn={this.addColumn} />
        </div>
    }
}

