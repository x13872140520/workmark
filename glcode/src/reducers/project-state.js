import keyMirror from 'keymirror';

const DONE_CREATING_COPY = 'scratch-gui/project-state/DONE_CREATING_COPY'; //完成复制创建 CREATING_COPY
const DONE_CREATING_NEW = 'scratch-gui/project-state/DONE_CREATING_NEW'; //完成新创建
const DONE_FETCHING_DEFAULT = 'scratch-gui/project-state/DONE_FETCHING_DEFAULT'; //完成获取抹去
const DONE_FETCHING_WITH_ID = 'scratch-gui/project-state/DONE_FETCHING_WITH_ID'; //完成指定ID获取
const DONE_LOADING_VM_TO_SAVE = 'scratch-gui/project-state/DONE_LOADING_VM_TO_SAVE'; //完成保存VM
const DONE_LOADING_VM_WITH_ID = 'scratch-gui/project-state/DONE_LOADING_VM_WITH_ID'; //完成用ID加载虚拟机
const DONE_LOADING_VM_WITHOUT_ID = 'scratch-gui/project-state/DONE_LOADING_VM_WITHOUT_ID'; //完成不用ID加载虚拟机
const DONE_REMIXING = 'scratch-gui/project-state/DONE_REMIXING';  //完成
const DONE_UPDATING = 'scratch-gui/project-state/DONE_UPDATING';  //完成更新
const DONE_UPDATING_BEFORE_COPY = 'scratch-gui/project-state/DONE_UPDATING_BEFORE_COPY';
const DONE_UPDATING_BEFORE_NEW = 'scratch-gui/project-state/DONE_UPDATING_BEFORE_NEW';
const RETURN_TO_SHOWING = 'scratch-gui/project-state/RETURN_TO_SHOWING';
const SET_PROJECT_ID = 'scratch-gui/project-state/SET_PROJECT_ID';
const START_AUTO_UPDATING = 'scratch-gui/project-state/START_AUTO_UPDATING';
const START_CREATING_NEW = 'scratch-gui/project-state/START_CREATING_NEW';
const START_ERROR = 'scratch-gui/project-state/START_ERROR';
const START_FETCHING_NEW = 'scratch-gui/project-state/START_FETCHING_NEW';
const START_LOADING_VM_FILE_UPLOAD = 'scratch-gui/project-state/START_LOADING_VM_FILE_UPLOAD';
const START_MANUAL_UPDATING = 'scratch-gui/project-state/START_MANUAL_UPDATING';
const START_REMIXING = 'scratch-gui/project-state/START_REMIXING';
const START_UPDATING_BEFORE_CREATING_COPY = 'scratch-gui/project-state/START_UPDATING_BEFORE_CREATING_COPY';
const START_UPDATING_BEFORE_CREATING_NEW = 'scratch-gui/project-state/START_UPDATING_BEFORE_CREATING_NEW';

const defaultProjectId = '0'; // hardcoded id of default project

const LoadingState = keyMirror({
    NOT_LOADED: null, //没有加载任何作品时的状态。此状态为Scratch初次加载时的一个必经状态，此时Scratch没有加载任何作品数据，也不知道要从哪里加载作品
    ERROR: null, //加载作品过程中出错的状态，用于报警与回到一个正确的状态。
    AUTO_UPDATING: null,//自动保存当前作品到服务器。（进入这个状态的一个前提：当前作品是从服务器加载的，通俗的讲，就是这个作品是用ID的。顺便聊一句：从本机加载或是新建的作品，都是没有作品ID的，所以无法自动保存，毕竟服务器上的作品，都是需要有作品ID，才知道谁是谁。）
    CREATING_COPY: null, //复制当前作品为一个新的作品（没有作品ID）。
    CREATING_NEW: null, //创建一个新的作品。（注：会判断前一个作品是否需要保存，并加载Scratch的默认作品，即src/lib/default-project目录下的那个作品，也就是我们一打开就会看到的好个小猫猫的空白作品）。
    FETCHING_NEW_DEFAULT: null, //从Scratch内部加载default-project目录下的那个默认作品。（作品ID=0，我们也可当他没有作品ID）
    FETCHING_WITH_ID: null, //根据给出的作品ID，从服务器加载一个作品。
    LOADING_VM_FILE_UPLOAD: null, //从本机直接加载一个作品到VM中。（这个最好理解，此时也没有作品ID）。
    LOADING_VM_NEW_DEFAULT: null, //把已经fetch成功的默认作品加载到VM中。
    LOADING_VM_WITH_ID: null, //把已经fetch成功的服务器作品加载到VM中。
    MANUAL_UPDATING: null, //手动保存作品。（即用户主动点击保存按钮时触发）
    REMIXING: null, //改编当前作品，即复制当前作品（新作品同样没有作品ID）。
    SHOWING_WITH_ID: null, //当前状态表示作品已有ID，即在服务器上有了，可以做一些有作品ID时的动作，比例：自动保存。
    SHOWING_WITHOUT_ID: null, //当前状态表示作品是一个默认作品或是从本机加载的作品。
    UPDATING_BEFORE_COPY: null,//复制作品前，保存当前作品。
    UPDATING_BEFORE_NEW: null //新建作品前，保存当前作品。
});

const LoadingStates = Object.keys(LoadingState);

const getIsFetchingWithoutId = loadingState => (
    // LOADING_VM_FILE_UPLOAD is an honorary fetch, since there is no fetching step for file uploads
    loadingState === LoadingState.LOADING_VM_FILE_UPLOAD ||
    loadingState === LoadingState.FETCHING_NEW_DEFAULT
);
const getIsFetchingWithId = loadingState => (
    loadingState === LoadingState.FETCHING_WITH_ID ||
    loadingState === LoadingState.FETCHING_NEW_DEFAULT
);
const getIsLoadingWithId = loadingState => (
    loadingState === LoadingState.LOADING_VM_WITH_ID ||
    loadingState === LoadingState.LOADING_VM_NEW_DEFAULT
);
const getIsLoading = loadingState => (
    loadingState === LoadingState.LOADING_VM_FILE_UPLOAD ||
    loadingState === LoadingState.LOADING_VM_WITH_ID ||
    loadingState === LoadingState.LOADING_VM_NEW_DEFAULT
);
const getIsLoadingUpload = loadingState => (
    loadingState === LoadingState.LOADING_VM_FILE_UPLOAD
);
const getIsCreatingNew = loadingState => (
    loadingState === LoadingState.CREATING_NEW
);
const getIsAnyCreatingNewState = loadingState => (
    loadingState === LoadingState.FETCHING_NEW_DEFAULT ||
    loadingState === LoadingState.LOADING_VM_NEW_DEFAULT ||
    loadingState === LoadingState.CREATING_NEW
);
const getIsCreatingCopy = loadingState => (
    loadingState === LoadingState.CREATING_COPY
);
const getIsManualUpdating = loadingState => (
    loadingState === LoadingState.MANUAL_UPDATING
);
const getIsRemixing = loadingState => (
    loadingState === LoadingState.REMIXING
);
const getIsUpdating = loadingState => (
    loadingState === LoadingState.AUTO_UPDATING ||
    loadingState === LoadingState.MANUAL_UPDATING ||
    loadingState === LoadingState.UPDATING_BEFORE_COPY ||
    loadingState === LoadingState.UPDATING_BEFORE_NEW
);
const getIsShowingProject = loadingState => (
    loadingState === LoadingState.SHOWING_WITH_ID ||
    loadingState === LoadingState.SHOWING_WITHOUT_ID
);
const getIsShowingWithId = loadingState => (
    loadingState === LoadingState.SHOWING_WITH_ID
);
const getIsShowingWithoutId = loadingState => (
    loadingState === LoadingState.SHOWING_WITHOUT_ID
);
const getIsError = loadingState => (
    loadingState === LoadingState.ERROR
);

const initialState = {
    error: null,
    projectData: null,
    projectId: null,
    loadingState: LoadingState.NOT_LOADED
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case DONE_CREATING_NEW:
        // We need to set project id since we just created new project on the server.
        // No need to load, we should have data already in vm.
        if (state.loadingState === LoadingState.CREATING_NEW) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID,
                projectId: action.projectId
            });
        }
        return state;
    case DONE_FETCHING_WITH_ID:
        if (state.loadingState === LoadingState.FETCHING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.LOADING_VM_WITH_ID,
                projectData: action.projectData
            });
        }
        return state;
    case DONE_FETCHING_DEFAULT:
        if (state.loadingState === LoadingState.FETCHING_NEW_DEFAULT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.LOADING_VM_NEW_DEFAULT,
                projectData: action.projectData
            });
        }
        return state;
    case DONE_LOADING_VM_WITHOUT_ID:
        if (state.loadingState === LoadingState.LOADING_VM_FILE_UPLOAD ||
            state.loadingState === LoadingState.LOADING_VM_NEW_DEFAULT) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITHOUT_ID,
                projectId: defaultProjectId
            });
        }
        return state;
    case DONE_LOADING_VM_WITH_ID:
        if (state.loadingState === LoadingState.LOADING_VM_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID
            });
        }
        return state;
    case DONE_LOADING_VM_TO_SAVE:
        if (state.loadingState === LoadingState.LOADING_VM_FILE_UPLOAD) {
            return Object.assign({}, state, {
                loadingState: LoadingState.AUTO_UPDATING
            });
        }
        return state;
    case DONE_REMIXING:
        // We need to set project id since we just created new project on the server.
        // No need to load, we should have data already in vm.
        if (state.loadingState === LoadingState.REMIXING) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID,
                projectId: action.projectId
            });
        }
        return state;
    case DONE_CREATING_COPY:
        // We need to set project id since we just created new project on the server.
        // No need to load, we should have data already in vm.
        if (state.loadingState === LoadingState.CREATING_COPY) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID,
                projectId: action.projectId
            });
        }
        return state;
    case DONE_UPDATING:
        if (state.loadingState === LoadingState.AUTO_UPDATING ||
            state.loadingState === LoadingState.MANUAL_UPDATING) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID
            });
        }
        return state;
    case DONE_UPDATING_BEFORE_COPY:
        if (state.loadingState === LoadingState.UPDATING_BEFORE_COPY) {
            return Object.assign({}, state, {
                loadingState: LoadingState.CREATING_COPY
            });
        }
        return state;
    case DONE_UPDATING_BEFORE_NEW:
        if (state.loadingState === LoadingState.UPDATING_BEFORE_NEW) {
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_NEW_DEFAULT,
                projectId: defaultProjectId
            });
        }
        return state;
    case RETURN_TO_SHOWING:
        if (state.projectId === null || state.projectId === defaultProjectId) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITHOUT_ID,
                projectId: defaultProjectId
            });
        }
        return Object.assign({}, state, {
            loadingState: LoadingState.SHOWING_WITH_ID
        });
    case SET_PROJECT_ID:
        // if the projectId hasn't actually changed do nothing
        if (state.projectId === action.projectId) {
            return state;
        }
        // if we were already showing a project, and a different projectId is set, only fetch that project if
        // projectId has changed. This prevents re-fetching projects unnecessarily.
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            // if setting the default project id, specifically fetch that project
            if (action.projectId === defaultProjectId || action.projectId === null) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.FETCHING_NEW_DEFAULT,
                    projectId: defaultProjectId
                });
            }
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_WITH_ID,
                projectId: action.projectId
            });
        } else if (state.loadingState === LoadingState.SHOWING_WITHOUT_ID) {
            // if we were showing a project already, don't transition to default project.
            if (action.projectId !== defaultProjectId && action.projectId !== null) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.FETCHING_WITH_ID,
                    projectId: action.projectId
                });
            }
        } else { // allow any other states to transition to fetching project
            // if setting the default project id, specifically fetch that project
            if (action.projectId === defaultProjectId || action.projectId === null) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.FETCHING_NEW_DEFAULT,
                    projectId: defaultProjectId
                });
            }
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_WITH_ID,
                projectId: action.projectId
            });
        }
        return state;
    case START_AUTO_UPDATING:
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.AUTO_UPDATING
            });
        }
        return state;
    case START_CREATING_NEW:
        if (state.loadingState === LoadingState.SHOWING_WITHOUT_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.CREATING_NEW
            });
        }
        return state;
    case START_FETCHING_NEW:
        if ([
            LoadingState.SHOWING_WITH_ID,
            LoadingState.SHOWING_WITHOUT_ID
        ].includes(state.loadingState)) {
            return Object.assign({}, state, {
                loadingState: LoadingState.FETCHING_NEW_DEFAULT,
                projectId: defaultProjectId
            });
        }
        return state;
    case START_LOADING_VM_FILE_UPLOAD:
        if ([
            LoadingState.NOT_LOADED,
            LoadingState.SHOWING_WITH_ID,
            LoadingState.SHOWING_WITHOUT_ID
        ].includes(state.loadingState)) {
            return Object.assign({}, state, {
                loadingState: LoadingState.LOADING_VM_FILE_UPLOAD
            });
        }
        return state;
    case START_MANUAL_UPDATING:
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.MANUAL_UPDATING
            });
        }
        return state;
    case START_REMIXING:
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.REMIXING
            });
        }
        return state;
    case START_UPDATING_BEFORE_CREATING_COPY:
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.UPDATING_BEFORE_COPY
            });
        }
        return state;
    case START_UPDATING_BEFORE_CREATING_NEW:
        if (state.loadingState === LoadingState.SHOWING_WITH_ID) {
            return Object.assign({}, state, {
                loadingState: LoadingState.UPDATING_BEFORE_NEW
            });
        }
        return state;
    case START_ERROR:
        // fatal errors: there's no correct editor state for us to show
        if ([
            LoadingState.FETCHING_NEW_DEFAULT,
            LoadingState.FETCHING_WITH_ID,
            LoadingState.LOADING_VM_NEW_DEFAULT,
            LoadingState.LOADING_VM_WITH_ID
        ].includes(state.loadingState)) {
            return Object.assign({}, state, {
                loadingState: LoadingState.ERROR,
                error: action.error
            });
        }
        // non-fatal errors: can keep showing editor state fine
        if ([
            LoadingState.AUTO_UPDATING,
            LoadingState.CREATING_COPY,
            LoadingState.MANUAL_UPDATING,
            LoadingState.REMIXING,
            LoadingState.UPDATING_BEFORE_COPY,
            LoadingState.UPDATING_BEFORE_NEW
        ].includes(state.loadingState)) {
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID,
                error: action.error
            });
        }
        // non-fatal error; state to show depends on whether project we're showing
        // has an id or not
        if (state.loadingState === LoadingState.CREATING_NEW) {
            if (state.projectId === defaultProjectId || state.projectId === null) {
                return Object.assign({}, state, {
                    loadingState: LoadingState.SHOWING_WITHOUT_ID,
                    error: action.error
                });
            }
            return Object.assign({}, state, {
                loadingState: LoadingState.SHOWING_WITH_ID,
                error: action.error
            });
        }
        return state;
    default:
        return state;
    }
};

const createProject = () => ({
    type: START_CREATING_NEW
});

const doneCreatingProject = (id, loadingState) => {
    switch (loadingState) {
    case LoadingState.CREATING_NEW:
        return {
            type: DONE_CREATING_NEW,
            projectId: id
        };
    case LoadingState.CREATING_COPY:
        return {
            type: DONE_CREATING_COPY,
            projectId: id
        };
    case LoadingState.REMIXING:
        return {
            type: DONE_REMIXING,
            projectId: id
        };
    default:
        break;
    }
};

const onFetchedProjectData = (projectData, loadingState) => {
    switch (loadingState) {
    case LoadingState.FETCHING_WITH_ID:
        return {
            type: DONE_FETCHING_WITH_ID,
            projectData: projectData
        };
    case LoadingState.FETCHING_NEW_DEFAULT:
        return {
            type: DONE_FETCHING_DEFAULT,
            projectData: projectData
        };
    default:
        break;
    }
};

const onLoadedProject = (loadingState, canSave, success) => {
    switch (loadingState) {
    case LoadingState.LOADING_VM_WITH_ID:
        if (success) {
            return {type: DONE_LOADING_VM_WITH_ID};
        }
        // failed to load project; just keep showing current project
        return {type: RETURN_TO_SHOWING};
    case LoadingState.LOADING_VM_FILE_UPLOAD:
        if (success) {
            if (canSave) {
                return {type: DONE_LOADING_VM_TO_SAVE};
            }
            return {type: DONE_LOADING_VM_WITHOUT_ID};
        }
        // failed to load project; just keep showing current project
        return {type: RETURN_TO_SHOWING};
    case LoadingState.LOADING_VM_NEW_DEFAULT:
        if (success) {
            return {type: DONE_LOADING_VM_WITHOUT_ID};
        }
        // failed to load default project; show error
        return {type: START_ERROR};
    default:
        return;
    }
};

const doneUpdatingProject = loadingState => {
    switch (loadingState) {
    case LoadingState.AUTO_UPDATING:
    case LoadingState.MANUAL_UPDATING:
        return {
            type: DONE_UPDATING
        };
    case LoadingState.UPDATING_BEFORE_COPY:
        return {
            type: DONE_UPDATING_BEFORE_COPY
        };
    case LoadingState.UPDATING_BEFORE_NEW:
        return {
            type: DONE_UPDATING_BEFORE_NEW
        };
    default:
        break;
    }
};

const projectError = error => ({
    type: START_ERROR,
    error: error
});

const setProjectId = id => ({
    type: SET_PROJECT_ID,
    projectId: id
});

const requestNewProject = needSave => {
    if (needSave) return {type: START_UPDATING_BEFORE_CREATING_NEW};
    return {type: START_FETCHING_NEW};
};

const requestProjectUpload = loadingState => {
    switch (loadingState) {
    case LoadingState.NOT_LOADED:
    case LoadingState.SHOWING_WITH_ID:
    case LoadingState.SHOWING_WITHOUT_ID:
        return {
            type: START_LOADING_VM_FILE_UPLOAD
        };
    default:
        break;
    }
};

const autoUpdateProject = () => ({
    type: START_AUTO_UPDATING
});

const manualUpdateProject = () => ({
    type: START_MANUAL_UPDATING
});

const saveProjectAsCopy = () => ({
    type: START_UPDATING_BEFORE_CREATING_COPY
});

const remixProject = () => ({
    type: START_REMIXING
});

export {
    reducer as default,
    initialState as projectStateInitialState,
    LoadingState,
    LoadingStates,
    autoUpdateProject,
    createProject,
    defaultProjectId,
    doneCreatingProject,
    doneUpdatingProject,
    getIsAnyCreatingNewState,
    getIsCreatingCopy,
    getIsCreatingNew,
    getIsError,
    getIsFetchingWithId,
    getIsFetchingWithoutId,
    getIsLoading,
    getIsLoadingWithId,
    getIsLoadingUpload,
    getIsManualUpdating,
    getIsRemixing,
    getIsShowingProject,
    getIsShowingWithId,
    getIsShowingWithoutId,
    getIsUpdating,
    manualUpdateProject,
    onFetchedProjectData,
    onLoadedProject,
    projectError,
    remixProject,
    requestNewProject,
    requestProjectUpload,
    saveProjectAsCopy,
    setProjectId
};
