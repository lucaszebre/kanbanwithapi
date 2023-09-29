import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BoardCart from '@/components/boardCart';
import '@testing-library/jest-dom'


describe('BoardCart Component Tests', () => {
  it('should render the BoardCart component with text', () => {
    const { getByText } = render(<BoardCart text="Board 1" selected={false} />);
    const boardText =  getByText('Board 1');
    expect(boardText).toBeInTheDocument();
  });

  it('should add the "selected" class when selected prop is true', () => {
    const { container, rerender } = render(<BoardCart text="Board 1" selected={false} />);
    const boardContainer = container.firstChild as HTMLElement;
    expect(boardContainer).not.toHaveClass('selected');

    rerender(<BoardCart text="Board 1" selected={true} />);
    expect(boardContainer).toHaveClass('selected');
  });

  it('should call the onClick function when clicked', () => {
    const onClickMock = jest.fn();
    const { container } = render(<BoardCart text="Board 1" selected={false} onClick={onClickMock} />);
    const boardContainer = container.firstChild as HTMLElement;

    fireEvent.click(boardContainer);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
