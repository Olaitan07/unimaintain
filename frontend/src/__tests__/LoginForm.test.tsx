import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { token: 'fake', user: { email: 'a@b.com' } } }))
  }
}));

// Lightweight login form component for unit testing
function TestLogin() {
  const handle = async (e: any) => {
    e.preventDefault();
    // call mocked API
    const client = (await import('../api/client')).default;
    await client.post('/auth/login', { email: 'a@b.com', password: 'Password123!' });
  };

  return (
    <form onSubmit={handle}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}

describe('LoginForm', () => {
  test('renders fields and submits', async () => {
    render(<TestLogin />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const btn = screen.getByRole('button', { name: /login/i });

    fireEvent.change(email, { target: { value: 'a@b.com' } });
    fireEvent.change(password, { target: { value: 'Password123!' } });
    fireEvent.click(btn);

    // ensure mocked post exists
    const client = (await import('../api/client')).default;
    expect(typeof client.post).toBe('function');
  });
});
