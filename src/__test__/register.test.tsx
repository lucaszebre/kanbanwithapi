import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/register"; // Adjust the import path as needed
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import mockRouter from 'next-router-mock';
import user from "@testing-library/user-event"
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

let queryClient: QueryClient;
jest.mock('next/navigation', () => jest.requireActual('next-router-mock'))




beforeAll(() => {
    queryClient = new QueryClient();
  
     
   });
  
  
  afterAll(() => {
    // Clean up queryClient or any other resources as needed
    queryClient.clear();
  });
describe("Register Component Tests", () => {
  it("should render the registration form",async () => {
    mockRouter.push('/register')
    render( <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>);
    
    // Check if form elements are present
    expect( screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByText("Let’s get you started sharing your links!")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Confirm password")).toBeInTheDocument();
    expect(screen.getByText("Password must contain at least 8 characters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create new account" })).toBeInTheDocument();
  });

  it("should display validation errors for invalid inputs", async () => {
    mockRouter.push('/register')

      
    render( <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>);
    
    // Attempt to submit the form with invalid inputs
    fireEvent.click(screen.getByRole("button", { name: "Create new account" }));

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(screen.getByText("Username must be at least 1 characters long")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeInTheDocument();
    });
  });
  
  it("should display validation errors for invalid inputs P1", async () => {
    mockRouter.push('/register')

      
    const { findByPlaceholderText, getByRole,findByText }= render( 
    <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>);
    
    const inputUser = (await findByPlaceholderText('At least 1 characters')) as HTMLInputElement;
    const inputEmail = (await findByPlaceholderText('e.g. alex@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('At least 8 characters')) as HTMLInputElement;
    const buttonRegister = getByRole('button');
    // Attempt to submit the form with invalid inputs
    user.type(inputUser,'blabla')
    user.type(inputEmail,'kiki1@gmail.com')
    user.type(inputPassword,'eeeeeeee')
    fireEvent.click(buttonRegister);

    // Check if validation errors are displayed
    const passwordError = (await findByText('Password must contain at least one digit')) 

    expect(passwordError).toBeInTheDocument();
  });
  
  it("should display validation errors for invalid inputs P2", async () => {
    mockRouter.push('/register')

      
    const { findByPlaceholderText, getByRole,findByText }= render( 
    <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>);
    
    const inputUser = (await findByPlaceholderText('At least 1 characters')) as HTMLInputElement;
    const inputEmail = (await findByPlaceholderText('e.g. alex@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('At least 8 characters')) as HTMLInputElement;
    const buttonRegister = getByRole('button');
    // Attempt to submit the form with invalid inputs
    await user.type(inputUser,'blabla')
    await user.type(inputEmail,'kiki1@gmail.com')
    await user.type(inputPassword,'eeeeee33e')
    await user.click(buttonRegister);

    // Check if validation errors are displayed
    const passwordError = (await findByText('Password must contain at least one special character')) 

    expect(passwordError).toBeInTheDocument();
  });
  
  it("should display validation errors for invalid inputs P3", async () => {
    mockRouter.push('/register')

      
    const { findByPlaceholderText, getByRole,findByText }= render( 
    <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>);
    
    const inputUser = (await findByPlaceholderText('At least 1 characters')) as HTMLInputElement;
    const inputEmail = (await findByPlaceholderText('e.g. alex@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('At least 8 characters')) as HTMLInputElement;
    const buttonRegister = getByRole('button');
    // Attempt to submit the form with invalid inputs
    await user.type(inputUser,'blabla')
    await user.type(inputEmail,'kiki1@gmail.com')
    await user.type(inputPassword,'33333@3333')
    await user.click(buttonRegister);

    // Check if validation errors are displayed
    const passwordError = (await findByText('Password must contain at least one letter')) 

    expect(passwordError).toBeInTheDocument();
  });

  it("should submit the form with valid inputs", async () => {
    // Mock the useRouter function to return a push function that updates the route
    
    
    mockRouter.push('/register')

    const { findByPlaceholderText, getByRole,findByText }= render( 
        <QueryClientProvider client={queryClient}>
            <Register />
          </QueryClientProvider>,{ wrapper: MemoryRouterProvider });
    
    const inputUser = (await findByPlaceholderText('At least 1 characters')) as HTMLInputElement;
    const inputEmail = (await findByPlaceholderText('e.g. alex@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('At least 8 characters')) as HTMLInputElement;
    const buttonRegister = getByRole('button');
    // Attempt to submit the form with invalid inputs
    await user.type(inputUser,'blabla')
    await user.type(inputEmail,'kiki1@gmail.com')
    await user.type(inputPassword,'33333@3dd333')
    await user.click(buttonRegister);

    // Mock a successful registration response here if needed

    // Check if the form has been submitted successfully
    await waitFor(() => {
        expect(mockRouter.asPath).toEqual('/');
    });
  });
});
