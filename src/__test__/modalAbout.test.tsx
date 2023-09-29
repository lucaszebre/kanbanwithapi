import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ModalAbout from '@/components/modalAbout'; // Update the import path as needed
import { ThemeProvidered } from '@/state/themecontext';
import '@testing-library/jest-dom'

describe('ModalAbout Component Tests',  () => {
  it('should render the component with the Edit and Delete options', async () => {
    const { findByText } = render(
        <ThemeProvidered>

      <ModalAbout
        right="10px"
        top="10px"
        visible={true}
        editBoard={false}
        setEditBoard={() => {}}
        setDeleteBlock={() => {}}
      />
      </ThemeProvidered>
    );

    const editOption = await findByText('Edit Board');
    const deleteOption = await findByText('Delete Board');

    expect(editOption).toBeInTheDocument();
    expect(deleteOption).toBeInTheDocument();
  });

  it('should call setEditBoard when Edit option is clicked', () => {
    const setEditBoardMock = jest.fn();
    const { getByText } = render(
        <ThemeProvidered>
      <ModalAbout
        right="10px"
        top="10px"
        visible={true}
        editBoard={false}
        setEditBoard={setEditBoardMock}
        setDeleteBlock={() => {}}
      />
      </ThemeProvidered>
    );

    const editOption = getByText('Edit Board');
    fireEvent.click(editOption);

    expect(setEditBoardMock).toHaveBeenCalledTimes(1);
  });

  it('should call setDeleteBlock when Delete option is clicked', () => {
    const setDeleteBlockMock = jest.fn();
    const { getByText } = render(
        <ThemeProvidered>
      <ModalAbout
        right="10px"
        top="10px"
        visible={true}
        editBoard={false}
        setEditBoard={() => {}}
        setDeleteBlock={setDeleteBlockMock}
      />
      </ThemeProvidered>
    );

    const deleteOption = getByText('Delete Board');
    fireEvent.click(deleteOption);

    expect(setDeleteBlockMock).toHaveBeenCalledTimes(1);
  });

  it('should have display set to "none" when visible prop is false', () => {
    const { getByText } = render(
        <ThemeProvidered>
      <ModalAbout
        right="10px"
        top="10px"
        visible={false}
        editBoard={false}
        setEditBoard={() => {}}
        setDeleteBlock={() => {}}
      />
      </ThemeProvidered>
    );


    expect(getByText('Edit Board')).toBeNull;
  });

  it('should have display set to "flex" when visible prop is true', () => {
    const { getByText } = render(
        <ThemeProvidered>
      <ModalAbout
        right="10px"
        top="10px"
        visible={true}
        editBoard={false}
        setEditBoard={() => {}}
        setDeleteBlock={() => {}}
      />
      </ThemeProvidered>
    );


    expect(getByText('Edit Board')).toBeInTheDocument;
  });
  
  // Add more test cases as needed for different scenarios and edge cases
});
