import Cell from './Cell.js';
import glb from '../other/global.js';
import {getRandomInt, getRandomNoneCell} from '../other/utils.js';

export default class Map {
    constructor (playgroundElement, numberOfCellPerLine, overlay, startLevel, xpManager){
        this.numberOfCellPerLine = numberOfCellPerLine;
        this.playground = playgroundElement;
        this.cells = [];
        this.cellHistory = [];
        this.tail = startLevel;
        this.initAllCells();
        this.injectCells();
        this.flow = 'stop';
        this.bonusOnWait = true;
        this.bonusActivate = false;
        this.overlay = overlay;
        this.xpManager = xpManager;
    }

    /* CALCUL THE PLAYGROUND & CELL SIZE/POSITION */
    initAllCells() {
        let size = this.playground.offsetWidth / this.numberOfCellPerLine;
        let offsetLeft = 0; // TODO : responsive
        var counter = 0;
        for (let iy = 0; iy < this.numberOfCellPerLine; iy++) {
            for (let ix = 0; ix < this.numberOfCellPerLine; ix++) {
                var posX = ix === 0 ? offsetLeft : offsetLeft + size*ix;
                var posY = iy === 0 ? 0 : size*iy;
                var cell = new Cell(size, posX, posY, glb.cellTypeEnum.none, counter);
                this.cells.push(cell);
                counter++;
            }
        }
    }
    /* ADD CELL ON MAP */
    injectCells() {
        let playground = this.playground;
        this.cells.forEach(cell => {
            cell.injectOnMap(playground);
        })
    }
    /* CREATE MOVEMENT */
    startIntervalMovement(refresh = glb.defaultRefresh){
        this.loop = setInterval(() => {
            
            this.flow = this.getCorrectFlow();
            if(this.flow !== 'stop' && !this.gameIsLoose){
                this.gameIsLoose === undefined ? this.overlay.pushBasicMessages(['<mark>🏁🏁🏁🏁🏁</mark>', '<mark>Go go go !</mark>', '<mark>🏁🏁🏁🏁🏁</mark>']) : null
                this.gameIsLoose = false;

                this.playground.setAttribute('data-flow', this.flow); // set the data flow each interval is better than setFlow

                this.movingSnake();
                this.updateBonusPos();
                this.updateApplePos();
            }else{
                glb.debug ? console.log('flow is set to stop ... or you loose your game !') : null
            }
        }, refresh);
    }
    /* MAIN FUNC, UPDATE THE GAME, CALL ON EACH INTERVAL */
    movingSnake(){
        var aci = this.getCellIndexByType(glb.cellTypeEnum.head);
        this.updateHistory(aci)
        this.cells[aci].updateType(glb.cellTypeEnum.none);
        switch(this.flow){ // each if on case work for snake V2
            case 'right':
                if((aci+1)/this.numberOfCellPerLine % 1 === 0){
                    aci -= this.numberOfCellPerLine;
                }
                aci+=1
            break;
            case 'left':
                if((aci)/this.numberOfCellPerLine % 1 === 0){
                    aci += this.numberOfCellPerLine;
                }
                aci-=1
            break;
            case 'bottom':
                if(aci + this.numberOfCellPerLine >= this.cells.length){
                    aci -= this.cells.length
                }
                aci+=this.numberOfCellPerLine
            break;
            case 'top':
                if(aci - this.numberOfCellPerLine < 0){
                    aci += this.cells.length
                }
                aci-=this.numberOfCellPerLine
            break;
        }
        this.updateTail(aci);
        this.activeCellByIndex(aci, glb.cellTypeEnum.head);
        this.checkEndGame(aci)
    }
    checkEndGame(aci){
        if(this.cellHistory.slice(0, -1).filter(cell => cell === aci).length){
            this.overlay.pushMessage(
            {
                elements : [
                    '<mark><em>❌❌❌❌❌❌<em></mark>', 
                    '<mark>You loose at</mark>',
                    '<mark>Level ' + (this.tail - glb.startLevel + 1).toString() + '</mark>',
                    '<mark><em>❌❌❌❌❌❌<em></mark>'],
                duration : 20000000
            })
            this.gameIsLoose = true;
            this.setFlow('stop')
        }
    }
    /* UPDATE THE HISTORY (needed on updateTail) */
    updateHistory(aci){
        this.cellHistory.unshift(aci);
        this.cellHistory.splice(this.tail + 1, 1)
    }

    /* INCREASE THE TAIL & UPDATE THE TAIL POS */
    updateTail(aci){
        if(aci === this.getCellIndexByType(glb.cellTypeEnum.apple)){
            var currentLvl = this.tail - glb.startLevel + 1

            if(getRandomInt(2)){
                this.overlay.pushMessage(
                {
                    elements : ['<mark><em>Level up</em></mark>', '<mark><em>#' + currentLvl.toString() + '</em></mark>'],
                    duration : 1200
                })
            }
            this.xpManager.addXp(getRandomInt(7)+25);
            this.tail++;
        }
        if(this.tail > 0){
            this.activeCellByIndex(this.cellHistory[0], glb.cellTypeEnum.tail);
            var cellToNone = this.cells[this.cellHistory[this.cellHistory.length-1]];
            cellToNone.updateType(glb.cellTypeEnum.none);

            var endTailCell = this.cells[this.cellHistory[this.cellHistory.length-2]];
            endTailCell !== undefined ? endTailCell.updateType(glb.cellTypeEnum.endTail) : null;
        }
    }

    /* GENERATE AN APPLE RANDOMLY */
    updateApplePos(){
        // check if an apple exist on map, if not create it
        var index = this.getCellIndexByType(glb.cellTypeEnum.apple);
        if(index == -1){
            // TODO: getRandomInt need to exclude busy cell
            let randomCell = getRandomNoneCell(this);
            this.activeCellByIndex(randomCell, glb.cellTypeEnum.apple)
        }
    }
    /* MANAGE BONUS - POSITION AND REPOP */
    updateBonusPos(){
        var index = this.getCellIndexByType(glb.cellTypeEnum.bonus);

        if(this.oldBonusIndex === this.getCellIndexByType(glb.cellTypeEnum.head)){
            this.activeCellByIndex(this.oldBonusIndex, glb.cellTypeEnum.head)
            this.activateRandomBonus()
        }
        this.oldBonusIndex = index // make a save to keep it on next interval


        if(index == -1 && this.bonusOnWait && !this.bonusActivate){
            this.bonusOnWait = false;
            var randomBonusTimeout = getRandomInt(4*1000);
            setTimeout(() => {
                // TODO: getRandomInt need to exclude busy cell
                this.activeCellByIndex(getRandomNoneCell(this), glb.cellTypeEnum.bonus)

                this.bonusOnWait = true;
            }, randomBonusTimeout);
        }
    }
    /* RETURN THE FIRST INDEX MATCH WITH TYPE ON MAP */
    getCellIndexByType(type){
        return this.cells.indexOf(this.cells.filter(cell => cell.type === type)[0]);
    }

    /* UPDATE CELL DEPEND ON INDEX, TYPE */
    activeCellByIndex(cellIndex, type){
        if(this.cells.includes(this.cells[Math.floor(cellIndex)])){
            this.cells[Math.floor(cellIndex)].updateType(type);
        }else{
            console.log('Active cell that does not exist ...', cellIndex);
            console.log('Trying to update on ...', type);
        }
        
    }

    /* SET A NEW FLOW */
    setFlow(flow){
        this.flow = flow
    }

    /* GET THE CORRECT FLOW : (Fix on moving flow too quick) */
    getCorrectFlow(){
        var correctFlow = 'stop';
        var oldFlow = this.playground.getAttribute('data-flow');
        switch(oldFlow){ // each if on case work for snake V2
            case 'right':
                correctFlow = this.flow === 'left' ? oldFlow : this.flow;
            break;
            case 'left':
                correctFlow = this.flow === 'right' ? oldFlow : this.flow;
            break;
            case 'bottom':
                correctFlow = this.flow === 'top' ? oldFlow : this.flow;
            break;
            case 'top':
                correctFlow = this.flow === 'bottom' ? oldFlow : this.flow;
            break;
            case 'stop':
                correctFlow = this.flow;
            break;
        }
        return correctFlow
    }

    /* MANAGE ACTIVATION BONUS */
    activateRandomBonus(){
        var randInt = getRandomInt(6);
        if(!this.bonusActivate){
            this.bonusActivate = true
            if(randInt < 2){
                this.overlay.pushMessage(
                    {
                        elements : ['<mark><em>Nocturne Vision<em></mark>', '<mark>👻 activated 👻</mark>'],
                        duration : 1500
                    })
                this.playground.classList.add('nocturne__vision');
                setTimeout(() => {
                    this.playground.classList.remove('nocturne__vision');
                    this.bonusActivate = false
                }, 1000*10);
            }else if(randInt < 4){
                this.overlay.pushMessage(
                    {
                        elements : ['<mark class="flash"><em>⚠️ Ooops ⚠️<em></mark>', '<mark class="flash">Speed increase !</mark>'],
                        duration : 2500
                    })
                clearInterval(this.loop);
                this.startIntervalMovement(Math.ceil(glb.defaultRefresh*0.80))
                setTimeout(() => {
                    clearInterval(this.loop);
                    this.startIntervalMovement(glb.defaultRefresh)
                    this.bonusActivate = false
                }, 5*1000);
            }else{
                this.overlay.pushMessage(
                    {
                        elements : ['<mark><em>🤩 MEGA BONUS 🤩<em></mark>', '<div class="clip-path-left-animation"><mark>+5 level !</mark></div>'],
                        duration : 2200
                    })
                this.tail += 5;
                this.bonusActivate = false
            }
        }
    }
}