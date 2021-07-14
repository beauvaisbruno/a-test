import React, { useState } from 'react';

import { CRYPTO_KEY_STORAGE_KEY, encryptedValidation } from '../constants';
import { wait } from '../helpers';
import { arrayBufferToBase64, decrypt, getDerivation, getKey, validateMasterPassword } from '../crypto';
import * as storage from '../storage';
import classes from './PasswordLockedContainer.module.css';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface Props {
    onSuccess: (password: CryptoKey) => void;
}

const PasswordLockedContainer = ({ onSuccess }: Props) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const validate = async () => {
            const derivation = await getDerivation(password);
            const key = await getKey(derivation);
            await wait(500);
            if (await validateMasterPassword(key, encryptedValidation)) {
                onSuccess(key);
                storage.setItem(CRYPTO_KEY_STORAGE_KEY, arrayBufferToBase64(derivation));
            }
            throw Error('wrong password');
        };

        setLoading(true);
        validate().catch(() => {
            setLoading(false);
            setError('Wrong password');
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    console.log('error', error);
    return (
        <div className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <h1>Enter your master password</h1>
                <label htmlFor="password-input">Password</label>
                <Input
                    id="password-input"
                    value={password}
                    onChange={handleChange}
                    type="password"
                    placeholder="***********"
                />
                {error && <div className={classes.error}>{error}</div>}
                <Button disabled={loading}>Submit</Button>
            </form>
        </div>
    );
};

export default PasswordLockedContainer;
