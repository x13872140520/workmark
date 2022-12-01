import PropTypes from 'prop-types';
import React from 'react';
import styles from './language-selectors.css';
import {MenuItem} from '../menu/menu.jsx';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
const LanguageSelectors = ({currentLocale, onChange, onMouseEnter}) => (
    <div className={styles.languagePanel} onMouseEnter={onMouseEnter}>
        <MenuItem  onClick={()=>{onChange('en')}}><FormattedMessage
                                            defaultMessage="English"
                                            description="choose english language"
                                            id="gui.menuBar.english"
                                        />{currentLocale=='en'?<div className={styles.active}></div>:null}</MenuItem>
        <MenuItem  onClick={()=>{onChange('zh-cn')}}><FormattedMessage
                                            defaultMessage="zh-cn"
                                            description="choose zh-cn language"
                                            id="gui.menuBar.china"
                                        />{currentLocale=='zh-cn'?<div className={styles.active}></div>:null}</MenuItem>
        <MenuItem  onClick={()=>{onChange('zh-tw')}}><FormattedMessage
                                            defaultMessage="zh-tw"
                                            description="choose zh-tw language"
                                            id="gui.menuBar.taiwan"
                                        />{currentLocale=='zh-tw'?<div className={styles.active}></div>:null}</MenuItem>
                                        

    </div>
);

LanguageSelectors.propTypes = {
    currentLocale: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default LanguageSelectors;
