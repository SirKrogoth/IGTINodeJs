console.log(process.argv);

const numero = parseInt(process.argv[2]);
const multiplos = [];

for (let index = 0; index < numero; index++) {
    if(index % 2 === 0){
        multiplos.push(index);
    }    
}

console.log(multiplos);