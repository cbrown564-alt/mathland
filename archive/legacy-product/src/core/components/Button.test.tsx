import { render, screen } from '@testing-library/react';
import { CharacterCard } from './CharacterCard';

const mockCharacter = {
  id: '1',
  name: 'Vera Vector',
  animal: 'GIRAFFE',
  concept: 'Vectors & Linear Algebra',
  tagline: 'I help you see the direction!',
  description: 'Meet Vera, our gentle giraffe who loves exploring the world of vectors and linear algebra.',
  gradientClass: 'bg-gradient-to-br from-purple-400 to-pink-400',
  image: '/lovable-uploads/vera.png'
};

describe('CharacterCard Component', () => {
  it('renders character information correctly', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    expect(screen.getByText('Vera Vector')).toBeInTheDocument();
    expect(screen.getByText('GIRAFFE')).toBeInTheDocument();
    expect(screen.getByText('Vectors & Linear Algebra')).toBeInTheDocument();
    expect(screen.getByText('"I help you see the direction!"')).toBeInTheDocument();
  });

  it('renders character image with correct alt text', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const image = screen.getByAltText('Vera Vector');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/lovable-uploads/vera.png');
  });

  it('renders meet button with character first name', () => {
    render(<CharacterCard character={mockCharacter} />);
    
    const button = screen.getByRole('button', { name: /meet vera/i });
    expect(button).toBeInTheDocument();
  });

  it('applies hover effects and animations', () => {
    const { container } = render(<CharacterCard character={mockCharacter} />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('group', 'hover:shadow-xl', 'hover:-translate-y-2');
  });
}); 