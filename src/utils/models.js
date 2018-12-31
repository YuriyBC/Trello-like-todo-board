export class ColumnModel {
    constructor({title, id}) {
        this.title = title;
        this.id = id;
        this.carts = [];
    }
}

export class CartModel {
    constructor({id, color, text, title, columnId}) {
        this.id = id;
        this.color = color;
        this.text = text;
        this.title = title;
        this.columnId = columnId;
    }
}