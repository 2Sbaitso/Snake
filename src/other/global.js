let global = {
    /* GLOBAL ENV VARIABLE */
    cellPerLine : 17,
    defaultRefresh : 166,
    startLevel : 2,
    defaultDurationOfOverlayMessage : 2000,
    cellTypeEnum : Object.freeze({ none : 0, head : 1, tail : 2, apple : 3, wall : 4, bonus : 5, endTail : 6 }),
    debug : false, // LOG CELL ID 
    /* END GLOBAL ENV VARIABLE */
};

module.exports = global;