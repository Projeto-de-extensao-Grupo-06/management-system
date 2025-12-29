import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from './Alert'; // Adjusted import path assuming it's in same folder

describe('Alert Component', () => {
    it('renders the error message correctly', () => {
        render(<Alert message="Something went wrong" type="error" />);
        const alertElement = screen.getByText('Something went wrong');
        expect(alertElement).toBeInTheDocument();
    });

    it('does not render when message is empty', () => {
        const { container } = render(<Alert message="" />);
        expect(container).toBeEmptyDOMElement();
    });
});
