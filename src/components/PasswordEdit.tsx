import React, { useCallback, useState } from 'react';

import Icon from '../atoms/Icon';
import LabelledIconButton from './LabelledIconButton';
import classes from './PasswordArea.module.css';
import Labelled from '../atoms/Labelled';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import clsx from 'clsx';
import TextArea from '../atoms/TextArea';
import { Password } from '../models';
import { isSpaceOrEnter } from '../helpers';

interface UrlListProps {
    urls: Array<string>;
    onDelete: (index: number) => void;
}

const UrlList = React.memo(({ urls, onDelete }: UrlListProps) => {
    return (
        <List className={classes.urlList}>
            {urls?.map((urlEntry, index) => (
                <ListItem key={index} dense className={classes.urlListItem}>
                    <input readOnly autoFocus value={urlEntry} />
                    <Icon
                        onKeyDown={(e) => isSpaceOrEnter(e) && onDelete(index)}
                        tabIndex={0}
                        role="button"
                        onClick={() => onDelete(index)}
                        size="small"
                        className="fas fa-times"
                    />
                </ListItem>
            ))}
            {urls?.length === 0 && (
                <ListItem dense className={clsx(classes.urlListItem, classes.urlListItemEmpty)}>
                    No urls added
                </ListItem>
            )}
        </List>
    );
});

interface PasswordEditProps {
    password: Password;
    onSave: (password: Password) => void;
    onDelete: () => void;
    onCancel: () => void;
}

function PasswordEdit({ password, onSave, onDelete, onCancel }: PasswordEditProps) {
    const [values, setValues] = useState<Password>(password);

    const [urlInput, setUrlInput] = useState('');

    function change(partial: { [name: string]: string | Array<string> }) {
        setValues((values) => ({
            ...values,
            ...partial,
        }));
    }

    function handleChange(e: React.ChangeEvent<any>) {
        change({ [e.target.name]: e.target.value });
    }

    function handleSaveClick() {
        onSave({
            ...password,
            ...values,
        });
    }

    function handleDeleteClick() {
        onDelete();
    }

    function handleCancelClick() {
        onCancel();
    }

    function handleUrlAdd() {
        const urls = values.url || [];

        urls.unshift(urlInput);

        change({ url: [...urls] });

        setUrlInput('');
    }

    const handleUrlDelete = useCallback((index) => {
        const urls = values.url || [];

        urls.splice(index, 1);

        change({ url: [...urls] });
    }, []);

    return (
        <div className={classes.container}>
            <h2 className={classes.title}>
                <input
                    autoFocus
                    className={classes.titleInput}
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                />
            </h2>
            <div className={classes.content}>
                <Labelled label="description">
                    <TextArea name="description" value={values.description} onChange={handleChange} />
                </Labelled>

                <Labelled label="value">
                    <Input name="value" value={values.value} onChange={handleChange} />
                </Labelled>

                <Labelled label="url">
                    <div>
                        <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            style={{ marginRight: 4 }}
                        />

                        <Button onClick={handleUrlAdd}>Add</Button>
                    </div>

                    <UrlList urls={values.url} onDelete={handleUrlDelete} />
                </Labelled>
            </div>
            <div className={classes.controls}>
                <LabelledIconButton
                    label="Cancel"
                    className={classes.cancel}
                    onClick={handleCancelClick}
                    icon={<Icon size="small" className="fas fa-times" />}
                />

                <LabelledIconButton
                    label="Save"
                    onClick={handleSaveClick}
                    icon={<Icon size="small" className="fas fa-save" />}
                />

                <LabelledIconButton
                    label="Delete"
                    className={classes.delete}
                    onClick={handleDeleteClick}
                    icon={<Icon size="small" className="fas fa-trash" />}
                />
            </div>
        </div>
    );
}

export default PasswordEdit;
