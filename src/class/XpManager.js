import glb from '../other/global.js';
import { getRandomInt } from '../other/utils'
export default class XpManager{
    constructor (template, overlay, lvlMax = 100){
        this.currentPercent = 71;
        this.template = template;
        this.overlay = overlay;
        this.timerRemove = null;
        this.lvlMax = lvlMax;
        this.progressBlockCount = 20
        this.currentXp = 0;
        this.lastXp = 0; // use for refresh or not the progress bar
        this.oldLevel = 0;
        this.defaultInterval = 50;
        this.levels = [];
        this.initTemplate();
        this.initXpLevel();
        this.initQueue();
    }

    initTemplate(){
        var progressContainer = document.createElement('div');
        progressContainer.classList.add('progress__container');

        var progressBar = document.createElement('div');
        progressBar.classList.add('progress__bar');

        for (let block = 0; block < this.progressBlockCount; block++) {
            var progressBlock = document.createElement('div');
            progressBlock.classList.add('progress__block');
            progressBlock.style = 'animation-delay :' + (block+1)*40 + 'ms';

            var bg = document.createElement('div');
            bg.classList.add('bg');

            progressBlock.appendChild(bg);
            progressBar.appendChild(progressBlock);
        }

        progressContainer.appendChild(progressBar);
        this.template.appendChild(progressContainer);

    }

    initQueue(){
        this.interval = setInterval(() => {
            this.refreshProgress();
        }, 1000);
    }

    refreshProgress(){
        if(this.lastXp !== this.currentXp){
            let lvl = this.getCurrentLevel();
            let floorStepXp = lvl > 0 ? this.levels[lvl-1] : 0;
            let ceilStepXp = lvl > 0 ?  this.levels[lvl] : this.levels[lvl];
            let percentOfLevel = Math.floor(((this.currentXp - floorStepXp) / (ceilStepXp - floorStepXp))*100)
            let countBlockToShow = Math.ceil(this.progressBlockCount * (percentOfLevel / 100)) ;
            for (let blockID = 0; blockID < countBlockToShow; blockID++) {
                let toShow = this.template.querySelector('.progress__bar > .progress__block:nth-child(' + Math.floor(blockID+1) + ')');
                toShow.style.opacity = "1";
            }
            let countBlockToHide = this.progressBlockCount - countBlockToShow;
            for (let blockID = 0; blockID < countBlockToHide; blockID++) {
                let currentIndexToHide = this.progressBlockCount - countBlockToHide + blockID;
                let toShow = this.template.querySelector('.progress__bar > .progress__block:nth-child(' + Math.floor(currentIndexToHide+1) + ')');
                toShow.style.opacity = "0";
            }
            this.lastXp = this.currentXp;
        }

    }

    initXpLevel(){
        for (let index = 0; index < this.lvlMax; index++) {
            var xpBefore = index === 0 ? 0 : this.levels[index-1]
            var xpForNextLevel = xpBefore*1.1 + this.defaultInterval;
            this.levels.push(
                Math.floor(xpForNextLevel)
            )
        }
        console.log(this.levels);
    }

    addXp(xpToAdd){
        this.currentXp += Math.floor(xpToAdd);
        let currentLevel = this.getCurrentLevel();
        /*if(this.oldLevel ==! currentLevel && getRandomInt(2) === 1){
            this.overlay.pushMessage(
            {
                elements : ['<mark><em>Level up</em></mark>', '<mark><em>#' + currentLevel.toString() + '</em></mark>'],
                duration : 1200
            })
            this.oldLevel = currentLevel;
        }*/
        return {currentLevel : this.getCurrentLevel(), levelUp : false};
    }

    getCurrentLevel(){
        var currentLevel = 0;
        this.levels.forEach((xp, i) => {
            if(this.levels[0] > this.currentXp){
                currentLevel = 0;
            }else if(this.levels[i] < this.currentXp && this.levels[i+1] > this.currentXp){
                currentLevel = i+1
            }
        })
        return currentLevel;
    }
}