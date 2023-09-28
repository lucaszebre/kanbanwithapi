import {  render} from "@testing-library/react"
import Login from "../components/login"
import user from "@testing-library/user-event"
import '@testing-library/jest-dom'
import { createMemoryHistory } from 'history'; // Use createMemoryHistory for Next.js
import { Router } from 'next/router'; // Import Router from next/router
import { QueryClient, QueryClientProvider } from 'react-query';

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient();
});

afterEach(() => {
  // Clean up queryClient or any other resources as needed
  queryClient.clear();
});


describe("Login components Test",()=>{
it("input and button should be present",async ()=>{
    const renderLogin = render(
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      );
    const inputEmail=  await renderLogin.findAllByPlaceholderText('e.g. lucasbeaugosse@email.com')
    expect(inputEmail).toBeTruthy();
    const inputPassword = await renderLogin.findAllByPlaceholderText('Enter your password');
    expect(inputPassword).toBeTruthy();
    const buttonLogin =  renderLogin.getAllByRole('button')
    expect(buttonLogin).toBeTruthy();
})

it('input fields should accept user input',async ()=>{
        const { findByPlaceholderText, getByRole } = render(
            <QueryClientProvider client={queryClient}>
            <Login />
            </QueryClientProvider>
        );
        
        const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
        const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;

        await user.type(inputEmail, 'lucasboss@gmail.com');
        await user.type(inputPassword, 'lucas22LLboss@gmail.com');
        
        expect(inputEmail).toBeInTheDocument();
        expect(inputPassword).toBeInTheDocument();
        
        // Check if the input fields have the expected values
        expect(inputEmail.value).toBe('lucasboss@gmail.com');
        expect(inputPassword.value).toBe('lucas22LLboss@gmail.com');
            
})

it('if the input is empty the error should show',async ()=>{
        const { findByPlaceholderText, getByRole,findByText } = render(
            <QueryClientProvider client={queryClient}>
            <Login />
            </QueryClientProvider>
        );
        
        const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
        const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;
        const buttonLogin = getByRole('button');

        
        expect(inputEmail).toBeInTheDocument();
        expect(inputPassword).toBeInTheDocument();
        
        // Check if the input fields have the expected values
        user.click(buttonLogin)

        expect(inputEmail.value).toBe('');
        expect(inputPassword.value).toBe('');
        const ErrorEmail = (await findByText('need a username') )
        const ErrorPassword = (await findByText('at least 8 characters long') )
        expect(ErrorEmail).toBeInTheDocument()
        expect(ErrorPassword).toBeInTheDocument()
            
})

it("if the password is not in the goodformat error should show P1",async ()=>{
    const { findByPlaceholderText, getByRole,findByText } = render(
        <QueryClientProvider client={queryClient}>
        <Login />
        </QueryClientProvider>
    );
    
    const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;
    const buttonLogin = getByRole('button');

    
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    
    // Check if the input fields have the expected values
    await user.click(buttonLogin)

    expect(inputEmail.value).toBe('');
    expect(inputPassword.value).toBe('');

    await user.type(inputPassword,'dddddddd')
    let ErrorPassword = (await findByText('must contain at least one digit') )
    expect(ErrorPassword).toBeInTheDocument()
})

it("if the password is not in the goodformat error should show P2",async ()=>{
    const { findByPlaceholderText, getByRole,findByText } = render(
        <QueryClientProvider client={queryClient}>
        <Login />
        </QueryClientProvider>
    );
    
    const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;
    const buttonLogin = getByRole('button');

    
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    
    // Check if the input fields have the expected values
    await user.click(buttonLogin)

    expect(inputEmail.value).toBe('');
    expect(inputPassword.value).toBe('');

    await user.type(inputPassword,'444444444')
    let ErrorPassword = (await findByText('must contain at least one letter') )
    expect(ErrorPassword).toBeInTheDocument()
})

it("if the password is not in the goodformat error should show P3",async ()=>{
    const { findByPlaceholderText, getByRole,findByText } = render(
        <QueryClientProvider client={queryClient}>
        <Login />
        </QueryClientProvider>
    );
    
    const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;
    const buttonLogin = getByRole('button');

    
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    
    // Check if the input fields have the expected values
    await user.click(buttonLogin)

    expect(inputEmail.value).toBe('');
    expect(inputPassword.value).toBe('');

    await user.type(inputPassword,'444444444ll')
    let ErrorPassword = (await findByText('at least one special character') )
    expect(ErrorPassword).toBeInTheDocument()
})

// Mock Next.js router events
jest.mock('next/router', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));

//   it('clicking on the link redirects to the register page',async () => {
//     const history = createMemoryHistory(); // Create a history object
//     const {  getByText } = render(
//         <Router router={history}>
//         <QueryClientProvider client={queryClient}>
//         <Login />
//         </QueryClientProvider>
//         </Router>
//     );
   
//     const link = getByText('Create account'); // Find the link by its text
//     user.click(link); // Simulate a click on the link
  
//     // Assert that the router's push function was called with the expected URL
//     expect(Router.useRouter().push).toHaveBeenCalledWith('/register');
//   });

})