import XpManager from './class/XpManager.js';
import Map from './class/Map.js';
import Overlay from './class/Overlay.js'
import glb from './other/global.js';

document.addEventListener("DOMContentLoaded", function(event) { 
    const snake = new Snake();
});

class Snake {
    constructor (){
        this.overlay = new Overlay(document.getElementById('app'))
        this.xpManager = new XpManager(document.getElementById('progress'), this.overlay);
        this.map = new Map(document.getElementById('app'), glb.cellPerLine, this.overlay, glb.startLevel, this.xpManager);
        this.startGame()
    }
    /* SETUP THE SNAKE AT CENTER & INIT THE INTERVAL MOVEMENT*/
    startGame() {
        this.map.activeCellByIndex((glb.cellPerLine*glb.cellPerLine) / 2, glb.cellTypeEnum.head)
        this.initKeyDown()
        this.map.startIntervalMovement();
    }

    /* HANDLE ARROW EVENT */
    initKeyDown() {
        document.onkeydown = (e) => {
            e = e || window.event
            switch(e.keyCode){
                case 38:
                    this.map.setFlow('top');
                break;
                case 39:
                    this.map.setFlow('right');
                break;
                case 40:
                    this.map.setFlow('bottom');
                break;
                case 37:
                    this.map.setFlow('left');
                break;
                case 32:
                    this.map.setFlow('stop');
                break;
            };
        };
    }
}