/*
 * @Author: your name
 * @Date: 2022-03-24 14:16:07
 * @LastEditTime: 2022-03-30 09:46:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/reducers/toolbox.js
 */
const UPDATE_TOOLBOX = 'scratch-gui/toolbox/UPDATE_TOOLBOX';
import makeToolboxXML from '../lib/make-toolbox-xml';

const initialState = {
    toolboxXML: makeToolboxXML(true)
};
//这里可能是拖拽判断执行的
const reducer = function (state, action) {

    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case UPDATE_TOOLBOX:
            return Object.assign({}, state, {

                toolboxXML: action.toolboxXML
            });
        default:
            return state;
    }
};

const updateToolbox = function (toolboxXML) {
    return {
        type: UPDATE_TOOLBOX,
        toolboxXML: toolboxXML
    };
};

export {
    reducer as default,
    initialState as toolboxInitialState,
    updateToolbox
};
