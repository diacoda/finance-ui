import { render, screen } from '@testing-library/react';
import Card from '../../src/components/Card';

test('renders Card with title and children', () => {
  render(<Card title="My Card">Content</Card>);
  expect(screen.getByText('My Card')).toBeInTheDocument();
  expect(screen.getByText('Content')).toBeInTheDocument();
});

test('renders Card without title', () => {
  render(<Card>Content Only</Card>);
  expect(screen.queryByText('undefined')).not.toBeInTheDocument();
});
