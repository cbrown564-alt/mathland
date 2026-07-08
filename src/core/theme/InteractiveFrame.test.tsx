import { render, screen } from '@testing-library/react';
import { InteractiveFrame } from './InteractiveFrame';

jest.mock('@/core/components/CharacterAnimation', () => ({
  CharacterAnimation: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe('InteractiveFrame', () => {
  it('shows character details when title is omitted', () => {
    render(
      <InteractiveFrame characterId="vera" fallbackSrc="/vera.png">
        <p>Demo body</p>
      </InteractiveFrame>,
    );

    expect(screen.getByText('Vera the Vector')).toBeInTheDocument();
    expect(screen.getByText('Demo body')).toBeInTheDocument();
  });

  it('prefers explicit title and handles unknown characters', () => {
    render(
      <InteractiveFrame characterId="unknown" fallbackSrc="/fallback.png" title="Custom title">
        <span>Child</span>
      </InteractiveFrame>,
    );

    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Custom title' })).toBeInTheDocument();
  });
});
