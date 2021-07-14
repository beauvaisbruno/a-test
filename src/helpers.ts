import React from 'react';
export const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));
export const isSpaceOrEnter = (evt: React.KeyboardEvent<any>) => evt.key == ' ' || evt.key == 'Enter';
