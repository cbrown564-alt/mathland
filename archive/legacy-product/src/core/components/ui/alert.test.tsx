import { render, screen } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Alert Message</Alert>);
    expect(screen.getByText('Alert Message')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { container } = render(<Alert>Default</Alert>);
    expect(container.firstChild).toHaveClass('bg-background');
  });
}); 