import React from 'react';

import Box from '../box/box.jsx';
import Selector from './selector.jsx';
import styles from './asset-panels.css';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {IconDelete} from '../../components/download-icon/download-icon.jsx';
const AssetPanels = props => (
    <Box className={styles.wrapper}>
        <Selector
            className={styles.selector}
            {...props}
        />
        {/* <Box className={styles.detailArea}>
            {props.children}
        </Box> */}
        {props.editedItemIsOpen? 
        <Modal
        className={styles.modalOverlay}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.editedItemIsOpen}
        onClose={()=>{console.log('close')}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
            <Fade in={props.editedItemIsOpen}>
                <Box className={styles.detailArea}>
                    <div  className={styles.closeBtn} onClick={()=>{props.onClose()}}>
                    <IconDelete
                    className={styles.closeBtnIcon} 
                    width={20}
                    height={20}
                    />
                        </div>
                    {props.children}
                </Box>
            </Fade>
        </Modal>:null}
       
    </Box>
);

AssetPanels.propTypes = {
    ...Selector.propTypes
};

export default AssetPanels;
