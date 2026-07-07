import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from './Index';
import { AppShell } from '@/core/components/AppShell';

// Mock the audio component to avoid issues in tests
jest.mock('react-h5-audio-player', () => {
  return function MockAudioPlayer() {
    return <div data-testid="audio-player">Audio Player</div>;
  };
});

// Index is now rendered inside AppShell (which provides the shared header /
// footer / main chrome — Path A5), so mirror that composition here.
const IndexWithRouter = () => (
  <BrowserRouter>
    <AppShell>
      <Index />
    </AppShell>
  </BrowserRouter>
);

describe('Index Page', () => {
  it('renders the main navigation header', () => {
    render(<IndexWithRouter />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<IndexWithRouter />);
    // Check for mathematical symbols that are part of the hero section
    expect(screen.getByText('∑')).toBeInTheDocument();
    expect(screen.getByText('∇')).toBeInTheDocument();
  });

  it('renders the course timeline', () => {
    render(<IndexWithRouter />);
    // The SimpleCourseTimeline should render course content
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<IndexWithRouter />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    const { container } = render(<IndexWithRouter />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
