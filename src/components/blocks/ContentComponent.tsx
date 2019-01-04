import * as React from 'react';
import ColumnComponent from '../ColumnComponent'
import AddColumnButton from '../AddColumnButton'

interface ContentComponentInterface {
    columnDara: Array<{
        id: number,
        title: string,
        carts: Array<object>
    }>,
    openCartForEdit: () => void,
    toggleCartEditor: () => void,
    addColumn: () => void,
    columnTitleChange: any
    onChangeDrag: () => void,
    removeColumn: () => void
}

export class ContentComponent extends React.Component <any, any> {
    constructor(props: ContentComponentInterface) {
        super(props);
        this.state = {
            isAddColumnButtonEditable: false,
            formRef: React.createRef()
        };
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.addColumn = this.addColumn.bind(this)
    }

    toggleEditMode(forceValue?: boolean): void {
        this.setState({
            isAddColumnButtonEditable: typeof forceValue === 'boolean' ? forceValue : !this.state.isAddColumnButtonEditable
        })
    }

    addColumn() {
        const columnTitle = this.state.formRef.current.value;
        if (columnTitle) {
            this.props.addColumn(this.state.formRef.current.value);
            this.state.formRef.current.value = ''
        } else {
            const RETURN_COLOR_TIME = 500;
            const formEl = this.state.formRef.current;
            const initialColor = this.state.formRef.current.style.boxShadow;

            formEl.style.boxShadow = 'inset 0 0 0 2px red';
            setTimeout(() => {
                formEl.style.boxShadow = initialColor
            }, RETURN_COLOR_TIME)
        }
    }

    render() {
        const columnData: any = this.props.columnData.map((column: {
            title: string,
            carts: Array<object>,
            id: number
        }) => {
            return <ColumnComponent title={column.title}
                                    openCartForEdit={this.props.openCartForEdit}
                                    carts={column.carts}
                                    toggleCartEditor={this.props.toggleCartEditor}
                                    columnTitleChange={this.props.columnTitleChange}
                                    removeColumn={this.props.removeColumn}
                                    key={column.id}
                                    onChangeDrag={this.props.onChangeDrag}
                                    id={column.id}/>
        });

        return <div className="columns-wrapper">
            {columnData}
            <AddColumnButton toggleEditMode={this.toggleEditMode}
                             isAddColumnButtonEditable={this.state.isAddColumnButtonEditable}
                             formRef={this.state.formRef}
                             addColumn={this.addColumn}/>
        </div>
    }
}

