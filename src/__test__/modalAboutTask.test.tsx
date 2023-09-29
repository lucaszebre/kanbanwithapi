import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvidered } from '@/state/themecontext';
import '@testing-library/jest-dom'
import ModalAboutTask from '@/components/modalAboutTask';


describe('ModalAboutTask Component Tests',  () => {
  it('should render the component with the Edit and Delete options', async () => {
    const { findByText } = render(
    <ThemeProvidered>
        <ModalAboutTask visible={true}/>
    </ThemeProvidered>
    );
    const editOption = await findByText('Edit Task');
    const deleteOption = await findByText('Delete Task');

    expect(editOption).toBeInTheDocument();
    expect(deleteOption).toBeInTheDocument();
  });

// it('should call setEditTask when Edit option is clicked', () => {
    
//     const { getByText } = render(
//         <ThemeProvidered>
//             <ModalAboutTask visible={true}  />
//         </ThemeProvidered>
//     );

//     const editOption = getByText('Edit Task');
//     fireEvent.click(editOption);

//     expect(useStore().setEditTask).toHaveBeenCalledTimes(1);
//   });

//   it('should call setDeleteBlock when Delete option is clicked', () => {
//     const setDeleteBlockMock = jest.fn();
//     const { getByText } = render(
//         <ThemeProvidered>
//       <ModalAbout
//         right="10px"
//         top="10px"
//         visible={true}
//         editBoard={false}
//         setEditBoard={() => {}}
//         setDeleteBlock={setDeleteBlockMock}
//       />
//       </ThemeProvidered>
//     );

//     const deleteOption = getByText('Delete Board');
//     fireEvent.click(deleteOption);

//     expect(setDeleteBlockMock).toHaveBeenCalledTimes(1);
//   });

  it('should have display set to "none" when visible prop is false', () => {
    const { getByText } = render(
    <ThemeProvidered>
            <ModalAboutTask visible={false} />
    </ThemeProvidered>
    );


    expect(getByText('Edit Task')).toBeNull;
    });

  
  
  // Add more test cases as needed for different scenarios and edge cases
});