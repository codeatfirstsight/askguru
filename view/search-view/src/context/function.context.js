import { getContext, setContext } from "svelte";


function saveFunction(name, func) {
    setContext(name, func);
}


function findFunction(name) {
    return getContext(name);
}

function executeFunction(name, args) {
    const func = findFunction(name);
    if(findFunction(name)) {
        return func(args);
    }
    return;
}

export { saveFunction, findFunction, executeFunction }