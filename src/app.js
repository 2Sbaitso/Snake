import XpManager from './class/XpManager.js';
import Map from './class/Map.js';
import glb from './other/global.js';
import { getRandomInt } from './other/utils.js';

document.addEventListener("DOMContentLoaded", function(event) { 
    const snake = new Snake();
});

class Snake {
    constructor (){
        this.xpManager = new XpManager(document.getElementById('progress'));
        this.overlay = new Overlay(document.getElementById('app'))
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

/* DISPLAY MESSAGE TO PLAYER */
class Overlay {
    constructor(){
        this.timerRemove = null;
        this.initTemplate();
        this.initQueue();
        this.queue = {
            messages : [],
            available : true
        };
    }

    initQueue(){
        this.interval = setInterval(() => {
            if(this.queue.available && this.queue.messages.length > 0){
                this.queue.available = false;
                var curMessages = this.queue.messages[0];
                this.show(curMessages.elements);
                setTimeout(() => {
                    this.hide(this.queue.messages[0].elements.length).then(() => {
                        this.queue.messages = this.queue.messages.slice(1);
                        this.queue.available = true
                    });
                }, this.queue.messages[0].duration);
            }
        }, 200);
    }
    initTemplate(){
        var overlay = document.createElement("div");
        overlay.setAttribute('id', 'overlay');

        var overlayContainer = document.createElement("div");
        overlayContainer.setAttribute('id', 'overlay-container');
        overlay.appendChild(overlayContainer);

        this.template = overlay;
    }

    /* PUBLIC 
    -> data {elements : Array of string, duration : how many time the message is show}
    -> html content is allow
    -> duration : milliseconds
    */
    pushMessage(data){
        this.queue.messages.push(data)
    }

    /* PUBLIC 
    -> messages array of string
    */
    pushBasicMessages(messages){
        this.queue.messages.push({
            elements : messages,
            duration : 1300
        })
    }

    /* PRIVATE 
    -> messages string
    -> html content is allow
    -> i index order message 
    -> randX float
    -> randy float
    */
    createMessage(message, i, randX, randY){
        var messageContainer = document.createElement("div");
        messageContainer.classList.add('message-container');
        messageContainer.style.animationDelay = i === 0 ? 0 + 'ms' : i*200 + 'ms';
        if(i === 0){
            messageContainer.style.marginTop = randX + 'px';
        }
        messageContainer.style.marginLeft = randY + 'px';
        var messageHtml = document.createElement("div");
        messageHtml.innerHTML = message;
        messageHtml.classList.add('message');

        messageContainer.appendChild(messageHtml);

        this.template.firstChild.appendChild(messageContainer)
    }

    /* PRIVATE 
    -> messages [] Array of string
    */
    show(messages){
        var marginLeft = (document.getElementById('app').offsetWidth * .3) / (getRandomInt(10) + 1);
        var marginTop = (document.getElementById('app').offsetHeight) / (getRandomInt(10) + 3);
        marginTop = messages.length > 2 ? Math.floor(marginTop * 0.75) : marginTop;
        messages.forEach((message, i) => this.createMessage(message, i, marginTop, marginLeft));
        document.body.appendChild(this.template);
    }

    /* PRIVATE */
    hide(NbrMessage){
        return new Promise((ok, err) => {
            this.template.firstChild.classList.add('out-message')
            setTimeout(() => {
                this.template.firstChild.classList.remove('out-message')
                this.template.firstChild.innerHTML = '';
                ok()
            }, 300 + (200*NbrMessage));
        })
    }

}