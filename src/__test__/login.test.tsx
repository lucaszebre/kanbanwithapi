import {  render, waitFor} from "@testing-library/react"
import Login from "../components/login"
import user from "@testing-library/user-event"
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
let queryClient: QueryClient;
import { useRouter } from 'next/router'; // Import useRouter from 'next/router'


beforeAll(() => {
  queryClient = new QueryClient();

   
 });


afterAll(() => {
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



test('Link is present and contain the right href',async () => {
  const { findByText } = render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );

  const link =(await  findByText('Create account')); // Find the link by its text
  user.click(link); // Simulate a click on the link
  
  expect(link).toBeInTheDocument()
  // Access the href attribute of the link
  const href = link.getAttribute('href');
  
  // Perform assertions on the href value
  expect(href).toBe('/register'); // You can adjust the expected href value
});

it("should redirect to the dashboard on successful login", async () => {
  // Render the Login component within the QueryClientProvider
  const { getByPlaceholderText, getByRole, findByPlaceholderText } = render(
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );

  // Simulate user input with valid credentials
  const inputEmail = (await findByPlaceholderText('e.g. lucasbeaugosse@email.com')) as HTMLInputElement;
    const inputPassword = (await findByPlaceholderText('Enter your password')) as HTMLInputElement;
    const buttonLogin = getByRole('button');

  user.type(inputEmail, "validemail@example.com");
  user.type(inputPassword, "val12p@assword");
  user.click(buttonLogin);

  // Wait for the expected redirection or success message
  await waitFor(async () => {
    // Check if the login form has disappeared (could use an appropriate selector)
    expect(await findByPlaceholderText('e.g. lucasbeaugosse@email.com')).toBeNull();
    expect(await findByPlaceholderText('Enter your password')).toBeNull();

  });
});
})