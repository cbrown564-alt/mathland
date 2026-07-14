import { render } from '@testing-library/react';
import { LessonHeader } from './LessonHeader';

describe('LessonHeader Component', () => {
  it('renders with progress bar at 0%', () => {
    const { container } = render(<LessonHeader progressPercentage={0} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with progress bar at 50%', () => {
    const { container } = render(<LessonHeader progressPercentage={50} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with progress bar at 100%', () => {
    const { container } = render(<LessonHeader progressPercentage={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('applies fixed positioning classes', () => {
    const { container } = render(<LessonHeader progressPercentage={25} />);
    expect(container.firstChild).toHaveClass('fixed', 'top-0', 'left-0', 'right-0');
  });

  it('has proper z-index for overlay', () => {
    const { container } = render(<LessonHeader progressPercentage={75} />);
    expect(container.firstChild).toHaveClass('z-50');
  });
});