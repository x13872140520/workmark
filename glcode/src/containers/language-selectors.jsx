import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {selectLocale} from '../reducers/locales';
import {closeLanguageMenu} from '../reducers/menus';
import LanguageSelectorsComponent from '../components/language-selectors/language-selectors.jsx';
class LanguageSelectors extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange'
        ]);
        document.documentElement.lang = props.currentLocale;
    }
    componentDidMount(){
        console.log('rrrrok')
    }
    handleChange (e) {
        console.log('选择了',e)
        const newLocale =e;
        if (this.props.messagesByLocale[newLocale]) {
            this.props.onChangeLanguage(newLocale);
            document.documentElement.lang = newLocale;
        }
        this.props.onChange()
    }
    render () { 
        const {
            onChangeLanguage, // eslint-disable-line no-unused-vars
            messagesByLocale, // eslint-disable-line no-unused-vars
            children,
            onMouseEnter,
            onChange,
            ...props
        } = this.props;
        return (
                <LanguageSelectorsComponent onChange={this.handleChange   } currentLocale={props.currentLocale} onMouseEnter={onMouseEnter}
                {...props}>     {children}
            </LanguageSelectorsComponent>
            
            );
    }
}

LanguageSelectors.propTypes = {
    children: PropTypes.node,
    currentLocale: PropTypes.string.isRequired,
    // Only checking key presence for messagesByLocale, no need to be more specific than object
    messagesByLocale: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChangeLanguage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentLocale: state.locales.locale,
    messagesByLocale: state.locales.messagesByLocale
});

const mapDispatchToProps = dispatch => ({
    onChangeLanguage: locale => {
        dispatch(selectLocale(locale));
        dispatch(closeLanguageMenu());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LanguageSelectors);
