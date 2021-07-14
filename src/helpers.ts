import React from 'react';

export const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

export const isSpaceOrEnter = (evt: React.KeyboardEvent<any>) => evt.key == ' ' || evt.key == 'Enter';

export function isValidURL(str: string) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
}
