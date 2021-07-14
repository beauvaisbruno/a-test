import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import classes from './ListItem.module.css';

interface Props extends React.ComponentPropsWithoutRef<'li'> {
    clickable?: boolean;
    dense?: boolean;
    highlight?: boolean;
}

function ListItem({ className, clickable, dense, onClick, highlight, ...rest }: Props) {
    const elementRef = useRef<HTMLLIElement>(null);
    const rootClassName = clsx(className, classes.root, {
        [classes.clickable]: clickable,
        [classes.dense]: dense,
    });

    useEffect(() => {
        if (!elementRef.current) {
            return;
        }
        if (highlight && !elementRef.current.classList.contains(classes.selected)) {
            elementRef.current.classList.add(classes.selected);
        }
        if (!highlight && elementRef.current.classList.contains(classes.selected)) {
            elementRef.current.classList.remove(classes.selected);
        }
    }, [highlight]);

    function handleClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        onClick && onClick(e);
    }

    return <li ref={elementRef} className={rootClassName} onClick={handleClick} {...rest} />;
}

export default ListItem;
