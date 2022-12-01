/*
 * @Author: your name
 * @Date: 2022-03-22 10:54:04
 * @LastEditTime: 2022-03-28 10:24:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/utils/message.js
 */

import { conforms } from "lodash";
import { useEffect } from "react";
import { unmountComponentAtNode, render } from "react-dom";
import StyleA from './index.css'

//message样式

const messageIcon = (type) => new Map([
    [
        "sunccess",
        'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'

    ], [
        "error",
        'M830.122667 573.653333a18.944 18.944 0 0 0-22.058667 15.36 322.901333 322.901333 0 0 1-318.549333 266.709334c-178.346667 0-323.413333-145.152-323.413334-323.498667a323.328 323.328 0 0 1 323.456-323.498667 323.456 323.456 0 0 1 318.378667 266.112 19.029333 19.029333 0 0 0 37.504-6.698666 357.546667 357.546667 0 0 0-56.149333-138.112A361.386667 361.386667 0 0 0 489.514667 170.666667 361.429333 361.429333 0 0 0 128 532.224c0 199.338667 162.176 361.557333 361.514667 361.557333a360.832 360.832 0 0 0 356.010666-298.069333 18.986667 18.986667 0 0 0-15.402666-22.058667" p-id="4660"></path><path d="M655.786667 363.776a20.181333 20.181333 0 0 0-28.544 0l-139.946667 139.946667-139.946667-139.946667a20.181333 20.181333 0 0 0-28.458666 28.458667l139.946666 139.946666-139.946666 139.946667a20.181333 20.181333 0 0 0 28.458666 28.501333l139.946667-139.946666 139.946667 139.946666a20.053333 20.053333 0 0 0 28.501333 0 20.181333 20.181333 0 0 0 0-28.458666l-139.946667-139.946667 139.946667-139.946667a20.181333 20.181333 0 0 0 0-28.501333'

    ], [
        "warring",
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'

    ], [
        "info",
        'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    ]

]).get(type)


const Mesaage = ({ icon, text, type = "info", onClose }) => {

    useEffect(() => {
        const T = setTimeout({
            onClose
        }, 3000)
        return () => {
            T && clearTimeout(T)

        }
    }, [])


    return (
        <div className={StyleA.messageBox} onClick={onClose}>
            <div className={StyleA.messageFlex}>
                {
                    icon || (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 mx-2 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={messageIcon(type)}
                            />
                        </svg>

                    )

                }
                <label>{text}</label>
            </div>
        </div>

    )

}


const getContainer = () => {
    const container = document.querySelector('#customMessageWrapper')
    if (!container) {
        const _container = document.createElement('div')
        _container.id = 'customMessageWrapper'
        _container.className = `fixed flex flex-col gap-4 top-0 items-center py-5 left-1/2 -translate-x-1/2`
        document.body.appendChild(_container)
        return _container
    }
    return container
}


const _message = (type) => (props) => {
    const container = getContainer();
    const _dom = document.createElement("div");

    container.appendChild(_dom);

    const hanldeClose = () => {
        unmountComponentAtNode(_dom);
        container.removeChild(_dom);
    };

    render(
        <Mesaage
            {...props}
            type={type}
            onClose={hanldeClose}
        />,
        _dom
    );
};
const error = _message("error");
const warning = _message("warning");
const success = _message("success");
const info = _message("info");

export default {
    error,
    warning,
    success,
    info,
};