
function getData() {
    return new Promise((resolve, reject)=>{
        resolve('Hola');
    });
}

function initializeData() {
    return function(){
        return getData().then((data) => 'datos inicializados')
    };
}

async function init() {
    console.log(await initializeData());
}

init();