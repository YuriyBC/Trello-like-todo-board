// https://github.com/YuriyBC/Helphul-javascript-methods

function calculateNextId (arr) {
    let idCollection = arr.map((el) => el.id);
    let id = 0;

    for (let i = 0; i < arr.length; i++) {
        if (idCollection.indexOf(id) === -1) {
            return id;
        }
        id++
    }
    return id
}

export {
    calculateNextId
}