import React from 'react';
import { clsx } from 'clsx'; 
import styles from './RadioButton.module.css';

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
    label,
    className,
    disabled,
    ...restProps
}) => {
    return (

        <label className={clsx(styles.label, className)}>
            <input
                type="radio"
                className={styles.input}
                disabled={disabled}
                {...restProps}
            />
            <span className={styles.radio} />
            <span className={styles.text}>{label}</span>
        </label>
    );
};