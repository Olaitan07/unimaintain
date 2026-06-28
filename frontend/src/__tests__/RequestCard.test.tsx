import { render, screen } from '@testing-library/react';
import RequestCard from '../components/RequestCard';

describe('RequestCard', () => {
  test('shows title and status badge', () => {
    render(<RequestCard request={{ id: '1', title: 'Fix AC', status: 'PENDING', priority: 'LOW' } as any} />);
    expect(screen.getByText(/Fix AC/i)).toBeDefined();
    expect(screen.getByText(/PENDING/i)).toBeDefined();
  });
});
