import { render, screen } from '@testing-library/react';
import App from './App';

// This test will fail as App component will call Fib, which will try to connect to Redis. 
// Hence, we remove the test. 
test('renders learn react link', () => {
  //render(<App />);
  //const linkElement = screen.getByText(/learn react/i);
  //expect(linkElement).toBeInTheDocument();
});
