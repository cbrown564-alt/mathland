import { render, screen } from '@testing-library/react';
import { InteractiveShell } from './InteractiveShell';

describe('InteractiveShell', () => {
  it('renders as an accessible region with the given label', () => {
    render(
      <InteractiveShell ariaLabel="Vector plot">
        <p>Interactive content</p>
      </InteractiveShell>,
    );

    expect(screen.getByRole('region', { name: 'Vector plot' })).toBeInTheDocument();
    expect(screen.getByText('Interactive content')).toBeInTheDocument();
  });

  it('applies optional className', () => {
    render(
      <InteractiveShell ariaLabel="Plot" className="custom-panel">
        <span>Child</span>
      </InteractiveShell>,
    );

    expect(screen.getByRole('region', { name: 'Plot' })).toHaveClass('custom-panel');
  });
});
