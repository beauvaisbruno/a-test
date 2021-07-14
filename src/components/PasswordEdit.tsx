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
import { isSpaceOrEnter, isValidURL } from '../helpers';

interface UrlListProps {
    urls: Array<string>;
    onDelete: (index: number) => void;
}

const UrlList = React.memo(({ urls, onDelete }: UrlListProps) => {
    return (
        <List className={classes.urlList}>
            {urls?.map((urlEntry, index) => (
                <ListItem clickable key={index} dense className={classes.urlListItem}>
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
    const [error, setError] = useState<string | null>(null);
    const [missingField, setMissingField] = useState<Array<string>>([]);

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
        const fields = [];
        if (!values.name || values.name.trim().length === 0) {
            fields.push('name');
        }
        if (!values.value || values.value.length === 0) {
            fields.push('value');
        }

        setMissingField(fields);
        if (fields.length > 0) return;

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
        if (!isValidURL(urlInput)) {
            setError('Mal-formatted url.');
            return;
        }
        if (values.url.includes(urlInput)) {
            setError('Url already present.');
            return;
        }
        setError(null);

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
                    placeholder={'My super secret password name'}
                />
            </h2>
            {missingField.includes('name') && (
                <div className={classes.error}>The password name should not be empty</div>
            )}
            <div className={classes.content}>
                <Labelled label="description">
                    <TextArea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        placeholder={'The password for my bank accounts'}
                    />
                </Labelled>

                <Labelled label="value">
                    <Input
                        name="value"
                        value={values.value}
                        onChange={handleChange}
                        type="password"
                        placeholder="***********"
                    />
                    {missingField.includes('value') && (
                        <div className={classes.error}>The password value should not be empty</div>
                    )}
                </Labelled>

                <Labelled label="url">
                    <div>
                        <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            style={{ marginRight: 4 }}
                            placeholder={'https://www.my-awesome-bank.com'}
                        />
                        <Button onClick={handleUrlAdd}>Add</Button>
                        {error && <div className={classes.error}>{error}</div>}
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
