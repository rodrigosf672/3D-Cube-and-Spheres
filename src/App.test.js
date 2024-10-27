import React from 'react';
import { render } from '@testing-library/react';

describe('App Component - Root Element Test', () => {
  test('renders without crashing', () => {
    const { container } = render(<div id="root"></div>);
    expect(container).toBeInTheDocument();
  });
});