import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('renders mathematical symbols', () => {
    render(<HeroSection />);
    expect(screen.getByText('∑')).toBeInTheDocument();
    expect(screen.getByText('∇')).toBeInTheDocument();
    expect(screen.getByText('∫')).toBeInTheDocument();
  });

  it('renders animated background elements', () => {
    const { container } = render(<HeroSection />);
    // Select elements with animation classes
    const animatedDivs = container.querySelectorAll('.animate-pulse, .animate-bounce');
    expect(animatedDivs.length).toBeGreaterThan(0);
  });
}); 