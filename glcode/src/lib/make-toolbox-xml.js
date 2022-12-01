import ScratchBlocks from 'scratch-blocks';

const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px




/* eslint-disable no-unused-vars */
const motion = function (isInitialSetup, isStage, targetId) {
    const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        'MOTION_STAGE_SELECTED',
        'Stage selected: no motion blocks'
    );
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGcSURBVHgBpZQ9SwNBEIbfPYMfSEAQFKySKo1Ry5DKoJ1irrcStEhl/oFJY2tSpVDQn3CCrZhGSHmijVVSpRYUjJAwzmTzcQnZuxUfWG5ub3dm752dUZjisEa7/HAJyCsgARsUfEXw54CyV1CtyU8D3Fta6f3ggghF/AMOVPlcQrl+oj5GAcR5t4M6m9thm4s5/aw8ISIK/K8F5CSII+9y8ijnp1kgk9BjGMgIYSf+3fcJ5dYo0QWaEVuQSQLJVW2/tYHXNmzIxXqE0jgTZhp8hOV5bVs6F1yHHLM0IkV6Y/z++K7HEPkrkc6E3ERH9DI5F703OcBeSs/dHAOXR9qWOZFsP2XOiVxzB2HMkG49jj+hDmrUNBXUWVbr3WjN3pwe/J3p2nJN+Yort8L2OSwYShXMQxhK4U4k8mwWy2nX4npIcm2YI5Sdh4Kqs12NWiynz2/xSE/erBCq0pf6SY51+rXgh60WnaUWJB/Xz4jiJbbIPhFsdlfcj/SkVT5CqIpzL9jsgkjr6AElUlyAhhqZhguqxQm9Z8MbSD7iF7Bde7NRrK/AAAAAAElFTkSuQmCC" name="%{BKY_CATEGORY_MOTION}"  id="motion"  colour="#4C97FF" secondaryColour="#4280D7">
        ${isStage ? `
        <label text="${stageSelected}"></label>
        ` : `
        <block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
   
        ${blockSeparator}
        <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_gotoxy">
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
        </block>
        <block type="motion_glideto" id="motion_glideto">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="motion_glideto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_pointindirection">
            <value name="DIRECTION">
                <shadow type="math_angle">
                    <field name="NUM">90</field>
                </shadow>
            </value>
        </block>
      <block type="motion_pointtowards">
            <value name="TOWARDS">
                <shadow type="motion_pointtowards_menu">
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_changexby">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_setx">
            <value name="X">
                <shadow id="setx" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_sety">
            <value name="Y">
                <shadow id="sety" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_ifonedgebounce"/>
        ${blockSeparator}
        <block type="motion_setrotationstyle"/>
        ${blockSeparator}
        <block id="${targetId}_xposition" type="motion_xposition"/>
        <block id="${targetId}_yposition" type="motion_yposition"/>
        <block id="${targetId}_direction" type="motion_direction"/>`}
        ${categorySeparator}
    </category>
    `;
};

const xmlEscape = function (unsafe) {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
};

//外观
const looks = function (isInitialSetup, isStage, targetId, costumeName, backdropName) {
    const hello = ScratchBlocks.ScratchMsgs.translate('LOOKS_HELLO', 'command!');
    const hmm = ScratchBlocks.ScratchMsgs.translate('LOOKS_HMM', 'Hmm...');
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHkSURBVHgBrVQ9SwNBEH27JicKgmAreDZWisHOSsWPRkSxsI6gopWKnQjGHyDEKvgBWoqVIlYqio2dRNDGxhSCjYIQUHLRrDN3ObK5u5yB+CDszuzkzbvZmRXwYHdG9as6TEBhnEwTVUAAaSWQjuawMX0gMp4zB/tx1fxtYF0BS6gBRJiMWHaij6LtkFsGrsnoxv8gHbUwwEkibLHyIPL6RsBoCGfKvge6Y8xJ67JIxZVZZ+BZP21qAfriQEsrkPtCKOpJwOsTcHvkTyYKGIhIAwkv+fAC8HAJPN2iKnQOAqMrwNlmeRJuFilVeWl6xhxil3xyzU/IIkZIhNHo2K6YziFPIHWipPaK6T4uCwczCSdzV1OL4nuhbrPL44KTtPlbxJRej6vKi+xbaf/+ApyniJCS9k6V/Nan/39UIWR0R+Ye6Bp0anl36lwyr0wamLhY847ewJi0FAonuufxwgnmi2McrqIiuCz843gWxULKQNMt7KdB4kr3u3Xnmlp/tCnfByu/OfC3aVSi3Z7knVmVpGyLQQScLAwVBo3Vb81tiyV7kqN5JPIG+mgbq5ogBNSZ9/RlCd7bXcRvBr8d1HtbqBWknMj7p5PaY6cjNa9MWUCCB9A7IyHIENOJ+MHx7J641g9+AYD4nUbw5NjTAAAAAElFTkSuQmCC" name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB">
        ${isStage ? '' : `
        <block type="looks_sayforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hello}</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_say">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hello}</field>
                </shadow>
            </value>
        </block>
        <block type="looks_thinkforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hmm}</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_think">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hmm}</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        `}
        ${isStage ? `
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_switchbackdroptoandwait">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
        ` : `
            <block id="${targetId}_switchcostumeto" type="looks_switchcostumeto">
                <value name="COSTUME">
                    <shadow type="looks_costume">
                        <field name="COSTUME">${costumeName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextcostume"/>
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
            ${blockSeparator}
            <block type="looks_changesizeby">
                <value name="CHANGE">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_setsizeto">
                <value name="SIZE">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
            </block>
        `}
        ${blockSeparator}
        <block type="looks_changeeffectby">
            <value name="CHANGE">
                <shadow type="math_number">
                    <field name="NUM">25</field>
                </shadow>
            </value>
        </block>
        <block type="looks_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_cleargraphiceffects"/>
        ${blockSeparator}
        ${isStage ? '' : `
            <block type="looks_show"/>
            <block type="looks_hide"/>
        ${blockSeparator}
            <block type="looks_gotofrontback"/>
            <block type="looks_goforwardbackwardlayers">
                <value name="NUM">
                    <shadow type="math_integer">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
        `}
        ${isStage ? `
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
        ` : `
            <block id="${targetId}_costumenumbername" type="looks_costumenumbername"/>
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
            <block id="${targetId}_size" type="looks_size"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sound = function (isInitialSetup, isStage, targetId, soundName) {
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH0SURBVHgBrZQ9T+NAEIbf3dgicSgoEkWg6AyI4lwdSPcDyC+Au/ZSpKKG9q44UkAL+QcpqPnooAJBjTBNXIYEGmQiBYEMkbEXz4IRRFkIH882u5rZd3ZnZ4ehC6foTIdhOMsSbAYCo+gPWwhhc52Xrap18tzA4km9VB+6CW7+R6Lz+AwMq6lEqjxWHWs/LB/FPd/bY4z9wNdgp7RUgYJotKKT9xJPfksiv5CX88v9S7gbLvSMDsMynnwCL8D14XX31kmZDWCBOSVnVNyJeq9jTKxMoLHUgH/hw/xr4nztXM4Hfw6+8KPgvWBgBS3wg0XOOFSQYHxSnuYImgG8mod+EBCzWiSuzHtru4XxpXH4rg8tq8FzPJmikbmRJ5/QC3G6eqqKMMNqxZrAK5BgwkjgtnmLj6C95UApovFRePQSJ/040iPHZH9lkTST8nb5+bx6k4DNox+4pbJTmRKZ3xmZ/5j2QRvDc8Mw/5m4OrxSbacqsjkH31Q50GPmijmkv6fR2mm9sNG7UGV1mh1lAOgoc2vN2ovKqdLL3lhuSHE6MVVLDAV1112crZwh9yenkq9QX5Kt4qh0NDRwN7AbTSfxBURpPzZ0Y5pahfxhU9WpdkfrFFQ3eSeVWJwWrNsqW4cvFiMLfcD+bkSVGGCLcbZJKX9uugf788hpcEKTAwAAAABJRU5ErkJggg==" name="%{BKY_CATEGORY_SOUND}" id="sound" colour="#D65CD6" secondaryColour="#BD42BD">
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block type="sound_changeeffectby">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sound_cleareffects"/>
        ${blockSeparator}
        <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_volume" type="sound_volume"/>
        ${categorySeparator}
    </category>
    `;
};

const events = function (isInitialSetup, isStage) {
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHESURBVHgBlVRtSkJBFD0zlZT9sR9FEIHSB0VEtgNdgbaEVpA7UFdQriBaQbUC3YGGRBSERgRRRPqjDwp93fOGSc03j9eB4b2ZuXPuvWfuXIU/8K6QQR95KOTgIYloaPhDo6w20R7eUL/ELSTwgaKQFpw08Yz5vtecJsJ4hBlxlELHTC35G2oy2wklXyia/6dyuBNmE0eWTrQ/ZeQuchKvtQbkBP+5ZjMaR9rnZAaieVI0bznJl46Bh/3xiKfTwPJp8J5FH1mNHkpwgeT3e4ZgXgLaeDVj8RD4bBhy2rigkdeh0ny3DREJYyngRsbtLjAxJw5LxjFt3FLllHcpdRNEbjVvZ03UJCYZMZEAVkXVa3GUrJo1x8VrREW/M3QqEfUUKFF7bJWRMCKLl4qRaSppyJld92Sw7ypbhYYWgc4RBB4gIeV6LgG9LrBSB9ZFmq874LFgKok2riry0FBeU1qDRjXQwJYpK4mXHbQXVqYaKfOSm/K8NQ5CndgLtmDkYeRARW2hYBzUpVXE/CzSLut/tQoPF5hFhq1i0OzoZFIenSsT64QI70MV6UOlkWY34pytg6/bPMA0ooCVyGLp40xtS9Mcwg+byKQgoGXBFAAAAABJRU5ErkJggg==" name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
        <block type="event_whenflagclicked"/>
        <block type="event_whenkeypressed">
        </block>
        ${isStage ? `
            <block type="event_whenstageclicked"/>
        ` : `
            <block type="event_whenthisspriteclicked"/>
        `}
        <block type="event_whenbackdropswitchesto">
        </block>
        ${blockSeparator}
        <block type="event_whengreaterthan">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="event_whenbroadcastreceived">
        </block>
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        <block type="event_broadcastandwait">
            <value name="BROADCAST_INPUT">
              <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const control = function (isInitialSetup, isStage) {
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHZSURBVHgBpVS7TgJBFD2zroViDI2J8RGptYDG+GjExMRSLSCx9Asg+gHAB6jQayxJgERsMNqIjbZQiIUNxEdMaNAIJmIY792Vh+6ybMJJJjs79+acuXfOjMA/yPiUFwNyk2YbEHDBDiRyUGjUGxGx/VrsDIlWzonTiRFHiGZB9AUZxcdnROxUKi0BjdwxnKU/ty2OsSWgfGuhQdVUa6ssomgLvHM75M45YO0SWElZ5wl4MDIU4qki4+Ounm0ZHAVm93TihyP8qYTXWNioEpTJKa8KVYTRbbdMzMMTASoFILMA1N+B+UM9Z2IdKOxT7M6UAlJuqlSEm5tmALeifKMT5qjalwtjTj4MSyhygwSkp2vCtQ+WcEwDM785hQNjXMKloB98vfVMUenEi6xkGm26pZgASgljnNtntvMmyK4qGuIMQgYMwfNF/cuHvHysO+aeyKqP7Rx3WD98M3EG3W4FQqRNg0zEgx2SIbEazVeS1HN/O6dE/3O7+ibMwE+HVklqMkqWCqAX+FBZZJi+qUnrXCliwv8c1AVOXU58168sHdUJ9r+ZbZtoII9azdt6KsRWsQJ1cJXaFYMdWJHTzpvkGrchzk+Hdru1C2ivIklOBJtFpIXvKdsZ+gG/pqGvOKLe9QAAAABJRU5ErkJggg==" name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block id="forever" type="control_forever"/>
        ${blockSeparator}
        <block type="control_if"/>
        <block type="control_if_else"/>
        <block id="wait_until" type="control_wait_until"/>
        <block id="repeat_until" type="control_repeat_until"/>
        ${blockSeparator}
        <block type="control_stop"/>
        ${blockSeparator}
        ${isStage ? `
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
        ` : `
            <block type="control_start_as_clone"/>
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_this_clone"/>
        `}
        ${categorySeparator}
    </category>
    `;
};


// const search = function () {
//     return `
//     <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIPSURBVHgBlVS/TxRREP7muQenFlCY2BGMFlJoLlETiyvAmFhYgPgXaGmjlNKcW10JlXS2Vng0FhRITChIjMkFCi1MPOw0FqyJ5I7b3WHm7e3dcbx3Ob5qdmfeN7+HMIBqrT3LwDwxLQA8jREg9nUirgNJ+PrJxUa/jnKhUuPJIsdvRHzpI5q6kpn/+svwgrDaPAzC8BkdZp8d8nGOt+WjNIy8PGOsvPMtHepEM2pFwZw6CfRHJ/KSj/jxnQuI/vcIyzcNJi4TPn5NnI400OJkXBFxiao1qTPHP/3kRojORnx1grB4363rIsGcZJBU4IFG/mE3xu8Itjz3rmcl2jtIsbWfWnK1WduMne/ZYN6A2VsaLYuSP7wtJbkEvBWid59iFMeyMmnk0RF3mz8ImawFDankIrcN7by7NWVsY1ttCCGwtZfi7g3TtVdbtxOaNhgRzXZPHi/QqM+gYTYGf2rqGnGOLz/STpnIkpdnCPsHPf2Qsa0bEG+4NPpA666p73yX8hwDzx8YvHhkpDewTdZJUhvvFDHXSU+DbMa2S5/vwPpugj8RO3W+XbBoxddsMavr7RVp6Cu/E2Ob2w+NfNgOMGN1+WlhKdtkE4RNjmfhmCglWNtMzn8q/gWhyt1xWJF71ExlvT2Z5NnkTr3kErmSnzp2/ai+l9MxJttNdgG9x+80qMEsw0LYWF4sfO7XnAD0vfhMDlbe1wAAAABJRU5ErkJggg==" name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
//     <label text="${stageSelected}"></label>
//   </category>`
// }

const sensing = function (isInitialSetup, isStage) {
    const name = ScratchBlocks.ScratchMsgs.translate('SENSING_ASK_TEXT', 'What\'s your name?');
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHLSURBVHgBtZQ/TAIxFMa/V05BiYYY/yaa4OagkcHBTS86msDq7q7ODsLgLq7uumLiDqMmDpgwOBgl0cREjRKBiHBc7Tv8c3J3SKL8lmvvvX59bb+W0MRK+mYRkmKSRJSAMNpCZgki6wMSKX0sb4/QZyOWvg7V4d+WwAb+gBLcLeItkdEnCx/9hrghuzIgMWtPHg74sDU9gKBGyBWqOMgXUTZMrIb7MT/oV22J5MUzrkqGY0UlVHWeROMuV66mcohvTIWwk3vCfaWOpdEeqx/UBE4fX7F2cv9VgHMSivSxJrBJsfRd2IC8dhPfvShY4q3wnsQqXRd1acabB/GAdsQZzuFV8hgnFBOSaLb5N+/z0mivVR1/vbDnnDxWHHEJERXqG2kO7OSe1SEGsDc3ZAl4wTHOGQkI7F++OOJsc81tIK9g/ewB0fEgejWBVhwqZx3dlj3jQvk+7xUsKRv+RqscFckKgnmEDiGIsmr9MoUO4ZNIiGN9IgOYSfw7ZpLfJeuQNdTiBvwLcHHUsrrBM6FuV4kR5SI390Ca5xrV4tz88dgZ6FI/xbo9t5VNGedlNJNccMr+2Nnhp6MOMy5hXcAI2oCd2DCLTDW2/Jt3omO9LDTTxOUAAAAASUVORK5CYII=" name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
        ${isStage ? '' : `
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
            <block type="sensing_touchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            <block type="sensing_coloristouchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
                <value name="COLOR2">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            <block type="sensing_distanceto">
                <value name="DISTANCETOMENU">
                    <shadow type="sensing_distancetomenu"/>
                </value>
            </block>
            ${blockSeparator}
        `}
        ${isInitialSetup ? '' : `
            <block id="askandwait" type="sensing_askandwait">
                <value name="QUESTION">
                    <shadow type="text">
                        <field name="TEXT">${name}</field>
                    </shadow>
                </value>
            </block>
        `}
        <block id="answer" type="sensing_answer"/>
        ${blockSeparator}
        <block type="sensing_keypressed">
            <value name="KEY_OPTION">
                <shadow type="sensing_keyoptions"/>
            </value>
        </block>
        <block type="sensing_mousedown"/>
        <block type="sensing_mousex"/>
        <block type="sensing_mousey"/>
        ${isStage ? '' : `
            ${blockSeparator}
            '<block type="sensing_setdragmode" id="sensing_setdragmode"></block>'+
            ${blockSeparator}
        `}
        ${blockSeparator}
        <block id="loudness" type="sensing_loudness"/>
        ${blockSeparator}
        <block id="timer" type="sensing_timer"/>
        <block type="sensing_resettimer"/>
        ${blockSeparator}
        <block id="of" type="sensing_of">
            <value name="OBJECT">
                <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
            </value>
        </block>
        ${blockSeparator}
        <block id="current" type="sensing_current"/>
        <block type="sensing_dayssince2000"/>
        ${blockSeparator}
        <block type="sensing_username"/>
        ${categorySeparator}
    </category>
    `;
};

const operators = function (isInitialSetup) {
    const apple = ScratchBlocks.ScratchMsgs.translate('OPERATORS_JOIN_APPLE', 'apple');
    const banana = ScratchBlocks.ScratchMsgs.translate('OPERATORS_JOIN_BANANA', 'banana');
    const letter = ScratchBlocks.ScratchMsgs.translate('OPERATORS_LETTEROF_APPLE', 'a');
    return `
    <category iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHeSURBVHgBpZQ7SwNBEMdnQgrFFCkELSzio1STUsHiAoIPBA/stBAbGwv9AmLURhtNChsbsdBOSCoVhEsj2pmgpY8rLBKwSJGQKJp1ZsnFdZOYU/8wHLuz95vZ3dlB0GRYUwaKDxMQpmkYAHdKIWCqDOX1ZPjMVh34BTb8HmhdEwAr8A8RMFqGIgVK5njsceAoWpI63Odtg43+VfltpJkuU5ojZiC0WsysBuDMATGo/+zz+mCkfVh+62k+MAdLfYuQf8/rrpBk8o4MazxA5/ekejtbOmCsc1RmztmdPMcJUoDzzAVkStkqnG3vfl/660mACHtQYER3tBE46B+AXl+PHAf9g3KsZs52aB81hMvsAU0MW5M3FCtUbwHv5HjoAGavF2oyZzhbE9meRnBHBToa54x/CWcFaAcTws3KP8ClvGQ2NHlQKpwveie0VbOGL/sh/6hPp7yUfoIex7IbOBvfSzp3W7OOj1KXQExxmRp025YbuKMOCqIrWymCbwFAdMtWYVgTUX0XjeBcrruh7RrY6t0mXL5cqVMxK3y6Uglg+hHeLLWiZrq412HdOm+6AyHSAksG9yOl2ZnUO14jP92HS8UEFCNOs0PdW2kdEQEYxCZvRJFNlqAzj1O7TqqOT8i2za7ugqbdAAAAAElFTkSuQmCC" name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_and"/>
        <block type="operator_or"/>
        <block type="operator_not"/>
        ${blockSeparator}
        ${isInitialSetup ? '' : `
            <block type="operator_join">
                <value name="STRING1">
                    <shadow type="text">
                        <field name="TEXT">${apple} </field>
                    </shadow>
                </value>
                <value name="STRING2">
                    <shadow type="text">
                        <field name="TEXT">${banana}</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_letter_of">
                <value name="LETTER">
                    <shadow type="math_whole_number">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_length">
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_contains" id="operator_contains">
              <value name="STRING1">
                <shadow type="text">
                  <field name="TEXT">${apple}</field>
                </shadow>
              </value>
              <value name="STRING2">
                <shadow type="text">
                  <field name="TEXT">${letter}</field>
                </shadow>
              </value>
            </block>
        `}
        ${blockSeparator}
        <block type="operator_mod">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const variables = function () {
    return `
    <category
        iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHzSURBVHgBjVS/L0NhFD1fVZD40cWvhKSJmiohFjHRiY1BjDazCgYL700GBDP+ARNbEwMTsUgNJoMmTZBYSiTVJvrc069PX/v0a8/S1+/HOfeee++nUAVnt28aSs1DYQ4OwmgMSbmTRL5gq823lHdD/RFboRA62raFNG6kaukEIrNA+hb4TPv3FQ4RyNpqNZOBK1Akb2+7ls9RI/m0DQxOAj0jwP0xcLWNmhk1ZWMUCRb/6sjN5NFFYFgiP55AAxhDQTiRWVXOTl8Yzeq57pXlO21LIo6G4TixoJBbxkNDM0BrF9A5COQSOhMX74/Ah9RhfFlbd7ZQeVeahRaZrekd0UUlvj/F/6gUWgS7Bkqispa+0TXxZYA5CowZBW72ge6o7p7b/fI615Yu9b53vSIDhANoBIya/nvByAnaZEBAVFLGE4yUVtAGF8xm9kCLcK82kgHx6cJ0ohg9wQxIvPairbk/0b5HZrRIzPbfVU4yKK10LtVeqSnAAtMGd2rZpvymILNihvOnugGqkYetJ3mv/1B+/CKMjNFebQGPZ6gJZpbzCRyp9de4nuSmFgs/uSm4HcWhcr1ll5jICT/5A76yFj/Kj91BOCQiVjGTSGm4nhL/Xa6HI5Iry/PYeaGfDliyNYp6M+JCOSk46oL1VBtv196tX7rapaFXVSpQAAAAAElFTkSuQmCC"
        name="%{BKY_CATEGORY_VARIABLES}"
        id="variables"
        colour="#FF8C1A"
        secondaryColour="#DB6E00"
        custom="VARIABLE">
    </category>
    `;
};

const myBlocks = function () {
    return `
    <category
        name="%{BKY_CATEGORY_MYBLOCKS}"
        id="myBlocks"
        colour="#FF6680"
        secondaryColour="#FF4D6A"
        custom="PROCEDURE">
    </category>
    `;
};


const markNewBlocks = function () {
    return `
    <category
  iconURI="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ6SURBVHgBrVXdThNREP6mLi3F0BSNAWITVqImXGAkXoA/iXhZb9QnUJ4AfALaJ7BvIG+g3oB36I2CF0I0sYlGqUYiRAIEI0opPc7sKbVwZjebwJdssrtzzvfNzJmZQ4iAWXiSRbV9HMaM8qffeNiATRAWUcczED2lq/lKGAepxK9nfJB5zK+jiAWaYtGiJpRwyOeej4vv8cmDXQ+QMAvm1fSEI31g2fzMJKejgKOAqEDD+aIjYD2vl3AcqOMhXbtdagoEOZe0ELLO4s5TQO4C0JEBPA/Y+QNsrQPLn+y7GgUXQZ2G5Ey8hv8Flbz/EtDVDawuAV/e2X8neMuZHDB4A/hRsUKHYZjLFsktalTMkrOobwDIsPflN0Bt1yVJpYGBYWClYh8NqZ2uBB/qXccgxOL5x7c6uUDSU54Hen1OXZu+5m9yIsGFescx9PjROW4VWV8Fun3dTnSTI8Blx5A5DWxvIRZ+/wJOdoZZ/YR6uHKQtRpiobrN69siBDRI6J6HWEh2RJpFoOL8lTrP9iAWpCDWvus27gddQDb09tlSjII0oQiIQxoMFqVMXzoG2SC1LXUeJiLkF68A3z6EVxuPczKzPPPTqQ11Qe48cJbHxM9lYGMF2OODT6ZtJ8voECe0Tm5GQOfsLJqbnkXYeJYIpC+EULC3ayNcY9H+QVtt+2PkAGiKRvJjXkNpLHTYSfhfy6o2Pr/nmXTd9oH0Q9NzHnZAMLJbxnVwWTzCcaBlXDf7gEb4hzFFHBXMsU8e8Dp2icRgUk1XJDGnRe7lFnJVIFhrLyC5I+4jHl7IOWqXPkXtCoRknMvElaH4P6pK8EgPtVdLNHRvM4zjH6cs6GB65Og8AAAAAElFTkSuQmCC"
        name="搜索"
        id="markNewBlocks"
        colour="#FF6680"
        secondaryColour="#FF4D6A"
       >
<div>11</div>
    </category>

`

}

/* eslint-enable no-unused-vars */

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isInitialSetup - Whether the toolbox is for initial setup. If the mode is "initial setup",
 * blocks with localized default parameters (e.g. ask and wait) should not be loaded. (LLK/scratch-gui#5445)
 * @param {?boolean} isStage - Whether the toolbox is for a stage-type target. This is always set to true
 * when isInitialSetup is true.
 * @param {?string} targetId - The current editing target
 * @param {?Array.<object>} categoriesXML - optional array of `{id,xml}` for categories. This can include both core
 * and other extensions: core extensions will be placed in the normal Scratch order; others will go at the bottom.
 * @property {string} id - the extension / category ID.
 * @property {string} xml - the `<category>...</category>` XML for this extension / category.
 * @param {?string} costumeName - The name of the default selected costume dropdown.
 * @param {?string} backdropName - The name of the default selected backdrop dropdown.
 * @param {?string} soundName -  The name of the default selected sound dropdown.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (isInitialSetup, isStage = true, targetId, categoriesXML = [],
    costumeName = '', backdropName = '', soundName = '') {
    isStage = isInitialSetup || isStage;
    // <sep gap=\"36\"/> 头部
    const gap = [categorySeparator];


    costumeName = xmlEscape(costumeName);
    backdropName = xmlEscape(backdropName);
    soundName = xmlEscape(soundName);

    categoriesXML = categoriesXML.slice();

    const moveCategory = categoryId => {
        const index = categoriesXML.findIndex(categoryInfo => categoryInfo.id === categoryId);
        if (index >= 0) {
            // remove the category from categoriesXML and return its XML

            const [categoryInfo] = categoriesXML.splice(index, 1);
            return categoryInfo.xml;
        }
        // return `undefined`
    };
    //运动 
    const motionXML = moveCategory('motion') || motion(isInitialSetup, isStage, targetId);

    //控制
    const controlXML = moveCategory('control') || control(isInitialSetup, isStage, targetId);
    //外观
    const looksXML = moveCategory('looks') || looks(isInitialSetup, isStage, targetId, costumeName, backdropName);
    //声音
    const soundXML = moveCategory('sound') || sound(isInitialSetup, isStage, targetId, soundName);
    //事件
    const eventsXML = moveCategory('event') || events(isInitialSetup, isStage, targetId);
    //看到
    const sensingXML = moveCategory('sensing') || sensing(isInitialSetup, isStage, targetId);
    //运算
    const operatorsXML = moveCategory('operators') || operators(isInitialSetup, isStage, targetId);
    // 变量
    const variablesXML = moveCategory('data') || variables(isInitialSetup, isStage, targetId);
    // 积木
    const myBlocksXML = moveCategory('procedures') || myBlocks(isInitialSetup, isStage, targetId);

    // 新建一个demo
    const markNewBlocksXMl = moveCategory('markNewBlocks') || markNewBlocks(isInitialSetup, isStage, targetId);


    const everything = [

        xmlOpen,
        // markNewBlocksXMl,
        motionXML, gap,
        controlXML, gap,
        eventsXML, gap,
        sensingXML, gap,
        soundXML, gap,
        looksXML, gap,
        operatorsXML, gap,
        variablesXML, gap,
        myBlocksXML,

    ];

    // const newPush = [
    //     motionXML, controlXML, eventsXML, sensingXML, soundXML,
    //     looksXML, operatorsXML, variablesXML
    // ]

    // newPush.map((e, v) => {


    //     const indexOfNumber = e.indexOf("block")

    //     if (indexOfNumber != -1) {

    //         const regPx = /block/g
    //         console.log(e)
    //     }



    // })


    for (const extensionCategory of categoriesXML) {
        everything.push(gap, extensionCategory.xml);
    }


    everything.push(xmlClose);




    return everything.join('\n');
};

export default makeToolboxXML;
