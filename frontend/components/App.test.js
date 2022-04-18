import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import AppClass from './AppClass';
// Write your tests here
test('renders without errors', () => {
  render(<AppClass />);
});

test('renders the coordinates', () => {
  render(<AppClass />);

  const coordinates = screen.getByText(/coordinates \(\d, \d\)/i);

  expect(coordinates).toBeInTheDocument();
});

test('that buttons appear on screen', () => {
  render(<AppClass />);

  const upButton = screen.getByText(/up/i);
  const leftButton = screen.getByText(/left/i);
  const rightButton = screen.getByText(/right/i);
  const downButton = screen.getByText(/down/i);
  const resetButton = screen.getByText(/reset/i);

  expect(upButton).toBeInTheDocument();
  expect(leftButton).toBeInTheDocument();
  expect(rightButton).toBeInTheDocument();
  expect(downButton).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
});

test('that the input field exists on the page', () => {
  render(<AppClass />);

  const emailInput = screen.getByPlaceholderText(/type email/i);

  expect(emailInput).toBeInTheDocument();
});

test('that typing in the email input shows what is typed in', async () => {
  render(<AppClass />);

  const emailInput = screen.getByPlaceholderText(/type email/i);
  userEvent.type(emailInput, 'test@email.com');

  const inputText = await screen.findByDisplayValue('test@email.com');

  expect(inputText).toBeInTheDocument();
})
