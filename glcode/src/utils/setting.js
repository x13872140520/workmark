/*
 * @Author: your name
 * @Date: 2022-04-07 09:54:03
 * @LastEditTime: 2022-04-13 11:22:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/utils/setting.js
 */

export const EverysArray = [
    //运动
    {
        name: "移动10步",
        yaxios: 0,
        ytans: 2,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "移动",
        numberSearch: "10"
    },
    {
        name: "右转15度",
        yaxios: 2.7,
        ytans: -27,

        blockStr: ` <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "右转",
        numberSearch: "15"
    },
    {
        name: "左转15度",
        yaxios: 7.8,
        ytans: -81,
        blockStr: `  <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "左转",
        numberSearch: "15"
    },
    {
        name: "移动到随机位置",
        yaxios: 16,
        ytans: -173,
        blockStr: ` <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>`,
        strSearch: "随机位置",
        numberSearch: "-1"
    }, {
        name: "移动到x:0,y:0",

        yaxios: 23,
        ytans: -244,
        blockStr: ` <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "移动",
        numberSearch: "0"
    },
    // 下面的block都没1自定义
    {
        name: "在1秒内滑行到随机位置",
        yaxios: 28,
        ytans: -303,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "随机位置",
        numberSearch: "1"
    },
    {
        name: "在1秒滑动到x:0",
        yaxios: 35,
        ytans: -377,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "移动",
        numberSearch: "10"
    },
    {
        name: "面向90方向",
        yaxios: 43,
        ytans: -460,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "方向",
        numberSearch: "90"
    },
    {
        name: "面向鼠标指针",
        yaxios: 51,
        ytans: -515,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "鼠标指针",
        numberSearch: "-1"
    },
    {
        name: "将x轴坐标增加10",
        yaxios: 59,
        ytans: -595,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "x",
        numberSearch: "10"
    }, {
        name: "将x轴坐标设为0",
        yaxios: 67,
        ytans: -665,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "x",
        numberSearch: "0"
    },
    {
        name: "将x轴坐标设为0",
        yaxios: 75,
        ytans: -735,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "x",
        numberSearch: "0"
    },
    {
        name: "将x轴坐标设为0",
        yaxios: 83,
        ytans: -805,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "x",
        numberSearch: "0"
    },
    {
        name: "将y轴坐标增为10",
        yaxios: 91,
        ytans: -875,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "y",
        numberSearch: "10"
    },
    {
        name: "将y轴坐标设为0",
        yaxios: 99,
        ytans: -945,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "y",
        numberSearch: "0"
    },

    //控制

    {
        name: "等待一秒",
        yaxios: 123,
        ytans: -1331,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "等待",
        numberSearch: "1"
    },
    {
        name: "重复执行10次",
        yaxios: 132,
        ytans: -1418,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "重复",
        numberSearch: "10"
    },
    {
        name: "重复执行",
        yaxios: 145,
        ytans: -1558,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "重复",
        numberSearch: "-1"
    },
    {
        name: "如果那么",
        yaxios: 158,
        ytans: -1703,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "如果",
        numberSearch: "-1"
    },
    {
        name: "如果那么否则",
        yaxios: 170,
        ytans: -1832,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "如果",
        numberSearch: "-1"
    },
    {
        name: "等待",
        yaxios: 185,
        ytans: -1991,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "等待",
        numberSearch: "-1"
    },
    {
        name: "重复执行直到",
        yaxios: 193,
        ytans: -2082,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "重复",
        numberSearch: "-1"
    },

    {
        name: "停止全部脚本",
        yaxios: 206,
        ytans: -2220,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "停止",
        numberSearch: "-1"
    },
    {
        name: "当作为克隆体启动时",
        yaxios: 214,
        ytans: -2308,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "克隆",
        numberSearch: "-1"
    },
    {
        name: "克隆自己",
        yaxios: 222,
        ytans: -2396,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "克隆",
        numberSearch: "-1"
    },
    {
        name: "删除克隆体",
        yaxios: 228,
        ytans: -2457,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "删除",
        numberSearch: "-1"
    },

    //事件
    {
        name: "当运行被点击",
        yaxios: 246,
        ytans: -2653,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "运行",
        numberSearch: "-1"
    },
    {
        name: "当按下空格键",
        yaxios: 248,
        ytans: -2670,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "空格",
        numberSearch: "-1"
    },
    {
        name: "当角色被点击",
        yaxios: 256,
        ytans: -2755,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "角色",
        numberSearch: "-1"
    },
    {
        name: "当响度>10",
        yaxios: 272,
        ytans: -2930,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "响度",
        numberSearch: "10"
    },
    {
        name: "当接收到消息1",
        yaxios: 279,
        ytans: -3008,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "消息",
        numberSearch: "1"
    },
    {
        name: "当背景换成backdrop1",
        yaxios: 261,
        ytans: -2815,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "背景",
        numberSearch: "-1"
    },
    {
        name: "广播消息1",
        yaxios: 288,
        ytans: -3102,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "广播",
        numberSearch: "1"
    },
    {
        name: "广播消息1并等待",
        yaxios: 294,
        ytans: -3177,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "广播",
        numberSearch: "1"
    },

    //侦测  坐标没改
    {
        name: "碰到鼠标指针",
        yaxios: 317,
        ytans: -3418,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "鼠标",
        numberSearch: "-1"
    },
    {
        name: "碰到颜色黑色",
        yaxios: 320,
        ytans: -3451,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "黑色",
        numberSearch: "-1"
    },
    {
        name: "颜色棕色碰到",
        yaxios: 326,
        ytans: -3508,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "颜色",
        numberSearch: "1"
    },
    {
        name: "碰到鼠标指针的距离",
        yaxios: 331,
        ytans: -3563,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "广播",
        numberSearch: "1"
    },
    {
        name: "询问你叫什么名字并等待",
        yaxios: 339,
        ytans: -3648,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "询问",
        numberSearch: "-1"
    },
    {
        name: "回答",
        yaxios: 344,
        ytans: -3648,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "回答",
        numberSearch: "-1"
    },
    {
        name: "按下空格键",
        yaxios: 351,
        ytans: -3710,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "空格",
        numberSearch: "-1"
    },
    {
        name: "按下鼠标",
        yaxios: 355,
        ytans: -3820,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "鼠标",
        numberSearch: "-1"
    },
    {
        name: "鼠标的x坐标",
        yaxios: 360,
        ytans: -3879,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "鼠标",
        numberSearch: "-1"
    },
    {
        name: "鼠标的y坐标",
        yaxios: 365.134,
        ytans: -3927,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "鼠标",
        numberSearch: "-1"
    },
    {
        name: "将拖动模式设置为可拖动",
        yaxios: 373.311,
        ytans: -4015,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "拖动",
        numberSearch: "-1"
    },
    {
        name: "响度",
        yaxios: 380.836,
        ytans: -4096,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "响度",
        numberSearch: "-1"
    },
    {
        name: "计时器",
        yaxios: 387.897,
        ytans: -4172,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "计时器",
        numberSearch: "-1"
    },
    {
        name: "计时器归零",
        yaxios: 394.401,
        ytans: -3177,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "计时器",
        numberSearch: "-1"
    },
    {
        name: "舞台的背景编号",
        yaxios: 401.555,
        ytans: -4319,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "舞台",
        numberSearch: "-1"
    },
    {
        name: "当前时间的年",
        yaxios: 409,
        ytans: -4404,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "时间",
        numberSearch: "-1"
    },
    {
        name: "2000年至今的天数",
        yaxios: 413.633,
        ytans: -4449,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "天数",
        numberSearch: "2000"
    },
    {
        name: "用户名",
        yaxios: 420.88,
        ytans: -4527,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "用户",
        numberSearch: "-1"
    },

    // 声音
    {
        name: "播放声音Meow等待播放完",
        yaxios: 430.45,
        ytans: -4630,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "播放",
        numberSearch: "-1"
    },
    {
        name: "播放声音Meow",
        yaxios: 439.369,
        ytans: -4726,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "播放",
        numberSearch: "-1"
    },
    {
        name: "停止所有的声音",
        yaxios: 445,
        ytans: -4792,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "停止",
        numberSearch: "-1"
    }, {
        name: "将音调音效增加10",
        yaxios: 454,
        ytans: -4894,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "音调",
        numberSearch: "10"
    },
    {
        name: "将音调音效设为100",
        yaxios: 460.553,
        ytans: -4954,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "音调",
        numberSearch: "100"
    },
    {
        name: "清除音效",
        yaxios: 466.778,
        ytans: -5021,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "播放",
        numberSearch: "-1"
    },
    {
        name: "将音量增加-10",
        yaxios: 475.511,
        ytans: -5115,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "音量",
        numberSearch: "-10"
    },
    {
        name: "将音量设为100%",
        yaxios: 482.665,
        ytans: -5192,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "音量",
        numberSearch: "100"
    },
    {
        name: "音量",
        yaxios: 487.496,
        ytans: -5244,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "音量",
        numberSearch: "-1"
    },
    // 外观
    {
        name: "说你好2秒",
        yaxios: 499.946,
        ytans: -5378,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "你好",
        numberSearch: "2"
    },
    {
        name: "说你好",
        yaxios: 507.286,
        ytans: -5457,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "你好",
        numberSearch: "-1"
    },
    {
        name: "思考嗯2秒",
        yaxios: 513.046,
        ytans: -5519,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "思考",
        numberSearch: "2"
    },
    {
        name: "思考嗯",
        yaxios: 519.55,
        ytans: -5589,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "思考",
        numberSearch: "-1"
    },
    {
        name: "换成costume2的造型",
        yaxios: 527,
        ytans: -5676,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "照型",
        numberSearch: "-1"
    },
    {
        name: "下一个造型",
        yaxios: 533,
        ytans: -5735,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "造型",
        numberSearch: "-1"
    },
    {
        name: "换成backdrop1背景",
        yaxios: 539.897,
        ytans: -5808,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "背景",
        numberSearch: "1"
    },
    {
        name: "下一个背景",
        yaxios: 546.401,
        ytans: -5878,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "背景",
        numberSearch: "-1"
    }, {
        name: "将大小增加10",
        yaxios: 554.112,
        ytans: -5961,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "大小",
        numberSearch: "10"
    }, {
        name: "将大小设置为100",
        yaxios: 559.594,
        ytans: -6020,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "大小",
        numberSearch: "100"
    }, {
        name: "将颜色特效增加25",
        yaxios: 570.186,
        ytans: -6134,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "颜色",
        numberSearch: "25"
    }, {
        name: "将颜色特效设定为25",
        yaxios: 575.4,
        ytans: -6191,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "颜色",
        numberSearch: "25"
    }, {
        name: "清除图形特效",
        yaxios: 582.078,
        ytans: -6262,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "清除",
        numberSearch: "-1"
    }, {
        name: "显示",
        yaxios: 589.78,
        ytans: -6345,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "显示",
        numberSearch: "-1"
    }, {
        name: "隐藏",
        yaxios: 597.78,
        ytans: -6431,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "隐藏",
        numberSearch: "-1"
    },
    {
        name: "移到最前面",
        yaxios: 605.956,
        ytans: -6519,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "移到",
        numberSearch: "-1"
    }, {
        name: "前移1层",
        yaxios: 613.482,
        ytans: -6600,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "前移",
        numberSearch: "1"
    }, {
        name: "造型编号",
        yaxios: 618.685,
        ytans: -6656,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "编号",
        numberSearch: "-1"
    }, {
        name: "背景编号",
        yaxios: 623.33,
        ytans: -6706,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "编号",
        numberSearch: "-1"
    }, {
        name: "大小",
        yaxios: 629.183,
        ytans: -6769,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "大小",
        numberSearch: "-1"
    },
    // 运算
    {
        name: "在1和10之间随机取数",
        yaxios: 662.166,
        ytans: -7124,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "随机",
        numberSearch: "1"
    }, {
        name: ">50",
        yaxios: 669.134,
        ytans: -7199,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "大于",
        numberSearch: "50"
    }, , {
        name: "<50",
        yaxios: 674.337,
        ytans: -7255,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "小于",
        numberSearch: "50"
    },
    {
        name: "=50",
        yaxios: 679.633,
        ytans: -7312,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "等于",
        numberSearch: "50"
    },
    {
        name: "连接苹果和香蕉",
        yaxios: 700.538,
        ytans: -7537,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "连接",
        numberSearch: "-1"
    },
    {
        name: "苹果的第1个字符",
        yaxios: 707.134,
        ytans: -7608,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "字符",
        numberSearch: "1"
    },
    {
        name: "苹果的字符数",
        yaxios: 712.895,
        ytans: -7670,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "苹果",
        numberSearch: "-1"
    },
    {
        name: "苹果包含果",
        yaxios: 716.983,
        ytans: -7714,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "苹果",
        numberSearch: "-1"
    },
    {
        name: "除以的余数",
        yaxios: 724.416,
        ytans: -7794,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "除以",
        numberSearch: "-1"
    },
    {
        name: "四舍五入",
        yaxios: 728.875,
        ytans: -7842,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "四舍五入",
        numberSearch: "-1"
    },
    {
        name: "绝对值",
        yaxios: 736.215,
        ytans: -7921,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "绝对值",
        numberSearch: "-1"
    },
    //变量
    {
        name: "建立一个变量",
        yaxios: 747.086,
        ytans: -8038,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "建立",
        numberSearch: "-1"
    },

    {
        name: "将设为",
        yaxios: 759.257,
        ytans: -8169,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "将设为",
        numberSearch: "-1"
    },
    {
        name: "将增加",
        yaxios: 763.809,
        ytans: -8218,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "将增加",
        numberSearch: "-1"
    },
    {
        name: "显示变量",
        yaxios: 769.941,
        ytans: -8284,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "变量",
        numberSearch: "-1"
    },
    {
        name: "隐藏变量",
        yaxios: 775.795,
        ytans: -8347,
        blockStr: `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`,
        strSearch: "变量",
        numberSearch: "-1"
    },

]
