import type React from 'react';

export default interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
