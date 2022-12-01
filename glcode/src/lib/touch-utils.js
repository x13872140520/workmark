const getEventXY = e => {
    if (e.touches && e.touches[0]) {
        return {x: e.touches[0].clientX, y: e.touches[0].clientY};
    } else if (e.changedTouches && e.changedTouches[0]) {
        return {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
    }
    return {x: e.clientX, y: e.clientY};
};
let count =0;
const multipleClickHandler = (obj) => {

    count += 1;
    setTimeout(() => {
      if (count === 1) {
        console.log('single click: ', count,obj[1]);
        obj[1]?obj[1]():null
      } else if (count === 2) {
        console.log('setTimeout onDoubleClick: ', count,obj[2]);
        obj[2]?obj[2]():null
      }
      count = 0;
    }, 300);
}
export {
    getEventXY,
    multipleClickHandler
};
