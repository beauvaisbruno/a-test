import React from 'react';

import classes from './PasswordArea.module.css';
import Icon from '../atoms/Icon';
import Labelled from '../atoms/Labelled';
import LabelledIconButton from './LabelledIconButton';
import { Password } from '../models';

interface PasswordViewProps {
    password: Password;
    onEdit: (password: Password) => void;
}

function PasswordView({ password, onEdit }: PasswordViewProps) {
    function handleEditClick() {
        onEdit(password);
    }

    return (
        <div className={classes.container}>
            <h2 className={classes.title}>{password.name}</h2>

            <div className={classes.content}>
                <Labelled label="description">{password.description || '-'}</Labelled>

                <Labelled label="value">{password.value || '-'}</Labelled>

                <Labelled label="url">{password.url.join(', ') || '-'}</Labelled>

                <Labelled label="created at">
                    {password.createdAt ? new Date(password.createdAt).toLocaleString() : '-'}
                </Labelled>

                <Labelled label="last modified at">
                    {(password.lastModifiedAt && new Date(password.lastModifiedAt).toLocaleString()) || '-'}
                </Labelled>
            </div>

            <div className={classes.controls}>
                <LabelledIconButton
                    label="Edit"
                    className={classes.edit}
                    onClick={handleEditClick}
                    icon={<Icon size="small" className="fas fa-pen" />}
                />
            </div>
        </div>
    );
}

export default PasswordView;
