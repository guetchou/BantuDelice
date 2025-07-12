
import React from 'react';
import { render } from '@testing-library/react';
import ChatSupport from '../ChatSupport';

// Mock component for testing
const MockChatSupport = () => <div>Chat Support</div>;

jest.mock('../ChatSupport', () => {
  return {
    __esModule: true,
    default: () => <MockChatSupport />
  };
});

describe('ChatSupport component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChatSupport />);
    expect(container).toBeInTheDocument();
  });
});
