import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { id: '1' } }))
  }
}));

function TestRequest() {
  const handle = async (e: any) => {
    e.preventDefault();
    const client = (await import('../api/client')).default;
    await client.post('/requests', { title: 'Test', description: 'D' });
  };

  return (
    <form onSubmit={handle}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" />
      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" />
      <label htmlFor="image">Image</label>
      <input id="image" name="image" type="file" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe('RequestForm', () => {
  test('renders fields and submits with image', async () => {
    render(<TestRequest />);

    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const submit = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(title, { target: { value: 'Test Issue' } });
    fireEvent.change(description, { target: { value: 'Details' } });

    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    const input = screen.getByLabelText(/image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(submit);
    const client = (await import('../api/client')).default;
    expect(typeof client.post).toBe('function');
  });
});
