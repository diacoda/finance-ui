import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Button from '../../src/components/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick handler', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalled();
});

test('disables button when disabled prop is true', () => {
  render(<Button disabled>Disabled</Button>);
  expect(screen.getByText('Disabled')).toBeDisabled();
});
