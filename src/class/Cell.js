import glb from '../other/global.js';

export default class Cell {
    constructor (size, posX, posY, type, index){
        this.size = size;
        this.posX = posX;
        this.posY = posY;
        this.type = type
        this.index = index
        this.initTemplate()
    }
    initTemplate(){
        var cell = document.createElement('div');
        cell.style.top = this.posY + 'px';
        cell.style.left = this.posX + 'px';
        cell.style.width = this.size + 'px';
        cell.style.height = this.size + 'px';
        cell.style.backgroundColor = 'transparent';
        glb.debug ? cell.innerHTML = '<span>' + this.index + '</span>' : null;
        this.template = cell;
    }
    injectOnMap(map){
        map.appendChild(this.template)
    }
    updateType(type){
        this.type = type;
        switch (type){
            case glb.cellTypeEnum.none:
                this.template.style.backgroundColor = 'transparent';
            break;
            case glb.cellTypeEnum.head:
                glb.debug ? this.template.style.backgroundColor = '#485df4' : null;
            break;
            case glb.cellTypeEnum.tail:
                glb.debug ? this.template.style.backgroundColor = '#485df4' : this.template.style.backgroundColor = 'transparent';
            break;
            case glb.cellTypeEnum.endTail:
                glb.debug ? this.template.style.backgroundColor = '#485df4' : this.template.style.backgroundColor = 'transparent';
            break;
            case glb.cellTypeEnum.apple:
                this.template.style.backgroundColor = '#c11a2c';
            break;
            case glb.cellTypeEnum.bonus:
                //
            break;
        }
        this.template.innerHTML = this.getInnerHTML(type);
    }
    getInnerHTML(type){
        var html = '';
        switch (type){
            case glb.cellTypeEnum.none:
                html = glb.debug ? '<span>' + this.index + '</span>' : '';
            break;
            case glb.cellTypeEnum.head:
                html = glb.debug ? '<span>' + this.index + '</span>' : '<div class="head__cell"></div>';
            break;
            case glb.cellTypeEnum.tail:
                html = glb.debug ? '<span>' + this.index + '</span>' : '<div class="tail__cell"></div>';
            break;
            case glb.cellTypeEnum.endTail:
                html = glb.debug ? '<span>' + this.index + '</span>' : '<div class="end-tail__cell"></div>';
            break;
            case glb.cellTypeEnum.apple:
                //
            break;
            case glb.cellTypeEnum.bonus:
                html = '<div class="pulse" style="background-color:#0093E9"></div>';
            break;
        }
        return html
    }
}