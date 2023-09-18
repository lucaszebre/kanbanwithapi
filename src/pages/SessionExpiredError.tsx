import Link from 'next/link';

const SessionExpiredError = () => {
    return (
        <div>
        <h1>Session Expired</h1>
        <p>Your session has expired. Please refresh the page and log in again.</p>
        <Link href="/">Go to Login</Link>
        </div>
    );
};

export default SessionExpiredError;
