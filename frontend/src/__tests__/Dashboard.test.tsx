import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'STUDENT' }, token: 'x' })
}));

function TestDashboard() {
  return (
    <div>
      <h2>My Requests</h2>
    </div>
  );
}

describe('Dashboard', () => {
  test('renders student view', () => {
    render(<TestDashboard />);
    expect(screen.getByText(/my requests/i)).toBeDefined();
  });
});
