import { render, screen } from '@testing-library/react';
import ListCard from '../../src/components/ListCard';

test('renders list items', () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  render(<ListCard title="My List" items={items} />);
  items.forEach(item => {
    expect(screen.getByText(item)).toBeInTheDocument();
  });
  expect(screen.getByText('My List')).toBeInTheDocument();
});
