import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonM from '@material-ui/core/Button';
import CreatOne from "./creatOne/index.js"
import { withStyles } from '@material-ui/core/styles';
import { useSubscribe, usePublish, useUnsubscribe } from '../../Pusconnect/usePubSub'
import styleA from "./index.css"
import CreatTwo from "./creatTwo/index.js"
import Grow from '@mui/material/Grow';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  intlShape,
} from "react-intl";
import { fingUserWorks } from '../../utils/api'
import { IconDelete } from '../../components/download-icon/download-icon.jsx';
const styles = {
  root: {


  },
  titleA: {
    width: "100%"
  }

};



const createProjectMessage = (
  <FormattedMessage
    defaultMessage="Create Project"
    description="open project from local"
    id="gui.menuBar.createProject"
  />
);
const personalProjectMessage = (
  <FormattedMessage
    defaultMessage="Your Project"
    description="open project from local"
    id="gui.menuBar.personalProject"
  />
);
const titleData = [
  { key: 1, title: createProjectMessage },
  // { key: 2, title: personalProjectMessage }
]
const Creat = (props) => {


  const [userData, setUserData] = useState({})

  const [statekey, setstatekey] = useState("")

  const [open, Setopen] = useState(false)

  const [openKey, SetopenKey] = useState(1)
  console.log('Creatinit', openKey)
  const [oldstatus, setoldstatus] = useState("")

  const SlideTransition = (props) => {
    return <Grow {...props} />;
  }
  // 弹窗
  const [messageKey, SetmessageKey] = useState({
    openMessage: false,
    messageText: "",

  })
  const publish = usePublish();
  const handleClose = () => {
    console.log('handleClose54')
    Setopen(false)
  }

  const OpenCreate = useSubscribe("OpenCreate", (msg, data) => {


    if (msg === "OpenCreate") {

      Setopen(data)

    }

  })

  const handleche = () => {


    // publish("commit", true)
    Setopen(false)
  }
  const unsubscribe = useUnsubscribe();

  useEffect(() => () => {
    unsubscribe(OpenCreate);
  }, [OpenCreate]);

  const newsethand = (e) => { //新增初始化creatTwo组件的时候，刷新作品列表，隐藏此处，不然与handlePageInit处引起的刷新重复了。
    setstatekey(e)
    requer(e)
  }
  const handdleCheckoue = (e) => {
    // 判断用户登录没登录

    let useLogin = window.sessionStorage.getItem("userAdmin");

    if (e === 2 && useLogin === null) {

      const publish = usePublish();
      publish("openMessage", {
        anchorOrigin: {
          vertical: 'top', horizontal: 'center'
        },
        open: true,
        message: "请先登录",

      })


      Setopen(false)

      publish("useLogin", true)
    } else {
      if (e === 2) {

        // requer("") //新增初始化creatTwo组件的时候，刷新作品列表，隐藏此处，不然与handlePageInit处引起的刷新重复了。
      }
      SetopenKey(e)

    }

  }

  const { classes } = props
  const handlePageInit = () => {
    console.log('handlePageInit')
    requer()
  }
  // 请求接口
  const requer = (e, p = 1) => {
    console.log('requer', e, p)
    let token = window.sessionStorage.getItem("userAdmin")
    let params = {
      currentPage: p,
      pageSize: 9,
      token,
      status: e
    }
    if (params.status === "" || params.status == 1) {

      delete params.status
    }
    fingUserWorks(params).then((res) => {

      let { data } = res
      if (data.code === "200") {

        setUserData(data.data)

      } else {

        publish("openMessage", {
          anchorOrigin: {
            vertical: 'top', horizontal: 'center'
          },
          open: true,
          message: "请求数据失败,请重新登录",

        })
      }
    })
  }


  const hanclonse = () => {


    Setopen(false)

    // Promise.resolve().then(() => {
    //   return StaticFun.NewPromsie(500, Setopen(false))

    // }).then((res) => {
    //   console.log(res)
    //   return StaticFun.NewPromsie(500, publish("openMessage", {
    //     anchorOrigin: {
    //       vertical: 'top', horizontal: 'center'
    //     },
    //     open: true,
    //     message: "上传成功",

    //   }))
    // })




  }


  const handleclose = () => {
    console.log('handleClose182')
    SetmessageKey({
      openMessage: false,
    })
  }



  const setPage = (e) => {

    requer(statekey, e)
  }

  // 作品名称
  const { authorUsername } = props
  console.log('authorUsername', authorUsername, props)
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="700"
      >
        <div className={styleA.closeBtn} onClick={() => { Setopen(false) }}>
          <IconDelete
            className={styleA.closeBtnIcon}
            width={20}
            height={20}
          />
        </div>
        <DialogTitle id="alert-dialog-title">
          <ul className={styleA.ulHome}>

            {titleData.map((e, v) => {


              return (<li ket={v}>
                <ButtonM onClick={() => handdleCheckoue(e.key)} variant={e.key === openKey ? "contained" : "outlined"} disableElevation>
                  {e.title}
                </ButtonM>
              </li>)
            })}
          </ul>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              openKey === 1 && (
                <CreatOne dataClick={handleche} vmProps={props} onClose={handleClose} ></CreatOne>
              )
            }
            {/* {
              openKey === 2 && (
                <CreatTwo
                  onStartSelectingFileUpload={
                    props.onStartSelectingFileUpload
                  }
                  onPageInit={handlePageInit}
                  hanclonse={hanclonse}
                  listdata={userData}
                  setsetHandle={newsethand}
                  setPage={setPage}
                  vmProps={props}
                ></CreatTwo>
              )
            } */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
      {/* <SSnackbar
        open={messageKey.openMessage}
        handlenewClose={() => handleclose()}
        message={messageKey.messageText}
        Transition={SlideTransition}
      ></SSnackbar> */}
    </div>
  )

}


export default withStyles(styles)(Creat)