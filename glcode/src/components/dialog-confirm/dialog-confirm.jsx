import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { FormattedMessage } from "react-intl";
export function ConfirmationDialogRaw(props) {
    const {
        onConfirm,
        onClose,
        onCancel,
        value: valueProp,
        open,
        saveText,
        nosaveText,
        cancelText,
        ...other
    } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef(null);
    console.log("onClose", onClose);
    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleSave = () => {
        onConfirm(value);
    };
    const handleNoSave = () => {
        onClose(value);
    };

    return (
        <Dialog
            maxWidth="xs"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">
                {props.title ? (
                    props.title
                ) : (
                    <FormattedMessage
                        defaultMessage="Save the current work?"
                        description="Title for dialog to confirm"
                        id="gui.sharedMessages.saveProjectWarning"
                    />
                )}
            </DialogTitle>
            <DialogContent dividers>
                <div>
                    {props.content ? (
                        props.content
                    ) : (
                        <FormattedMessage
                            defaultMessage="Recommanded to save"
                            description="Title for dialog to confirm"
                            id="gui.sharedMessages.saveTip"
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    {cancelText ? (
                        cancelText
                    ) : (
                        <FormattedMessage
                            defaultMessage="Cancel"
                            description="Title for button to cancel"
                            id="gui.customProcedures.cancel"
                        />
                    )}
                </Button>
                {onClose ? (
                    <Button onClick={handleNoSave} color="primary">
                        {nosaveText ? (
                            nosaveText
                        ) : (
                            <FormattedMessage
                                defaultMessage="Do not save"
                                description="Title for button to dont save"
                                id="gui.sharedMessages.nosave"
                            />
                        )}
                    </Button>
                ) : null}

                <Button onClick={handleSave} color="primary">
                    {saveText ? (
                        saveText
                    ) : (
                        <FormattedMessage
                            defaultMessage="Save"
                            description="Title for button to save"
                            id="gui.soundEditor.save"
                        />
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialogRaw.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};
