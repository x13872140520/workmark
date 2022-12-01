/*
 * @Author: your name
 * @Date: 2022-01-21 10:54:51
 * @LastEditTime: 2022-01-21 10:54:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mac/demo/boke/src/usePubsub/index.js
 */

import PubSub from 'pubsub-js';

export function useSubscribe (msg, callback) {
    return PubSub.subscribe(msg, callback);
}
export function usePublish () {
    return PubSub.publish;
}
export function useUnsubscribe () {
    return PubSub.unsubscribe;
}
