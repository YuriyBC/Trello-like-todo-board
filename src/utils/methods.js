// https://github.com/YuriyBC/Helphul-javascript-methods

function calculateNextId(arr) {
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

function generateRandomId() {
    return Math.floor((Math.random() * 1000) + 1);
}

function storage(...args) {
    if (args.length === 1) {
        return window.localStorage.getItem(args[0])
    } else if (args.length === 2) {
        return window.localStorage.setItem(args[0], args[1])
    }
}

function removeFocusFromAllElements() {
    const tmp = document.createElement('input');
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}

var inThrottle = false

function throttle(func, limit) {
    if (inThrottle) {
        return
    }
    if (!inThrottle) {
        inThrottle = true
        func()
        setTimeout(() => {
            inThrottle = false
        }, limit)
    }
}

export {
    calculateNextId,
    storage,
    removeFocusFromAllElements,
    throttle,
    generateRandomId
}