const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}
const getHexaRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
const getRandomNoneCell = (map) => { // need to be init after getRandomInt
    var busyCell = map.cells.filter(cell => cell.template.innerHTML !== "").map(cell => cell.index);
    var randomNoneCell = -1;
    for (let index = 0; randomNoneCell === -1; index++) {
        let randomCell = getRandomInt(map.numberOfCellPerLine*map.numberOfCellPerLine) 
        if(!busyCell.includes(randomCell)){
            randomNoneCell = randomCell
        }else{
            console.log('FOUND CELL ALREADY USE', randomCell)
        }
    }
    return randomNoneCell
}



export {
    getRandomInt, 
    getRandomNoneCell, 
    getHexaRandomColor,
}