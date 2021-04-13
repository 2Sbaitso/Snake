export default class XpManager{
    constructor (template, lvlMax = 100){
        this.template = template
        this.timerRemove = null;
        this.lvlMax = lvlMax;
        this.currentXp = 0;
        this.defaultInterval = 50
        this.levels = [];
        this.initXpLevel()
        this.initQueue();
    }

    initQueue(){
        this.interval = setInterval(() => {
            
        }, 200);
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
        var currentLevel = this.getCurrentLevel();
    }

    getCurrentLevel(){

        // TODO 
        var currentLevel = 0;
        console.log(this.currentXp);
        this.levels.forEach((xp, i) => {
            if(i === 0){
                if(this.levels[0] > this.currentXp){
                    //console.log('LEVEL 0');
                }
            }
            else if(xp < this.currentXp && this.levels[i+1] > this.currentXp){
                console.log('found correct level', i+1);
            }
        })
    }
}