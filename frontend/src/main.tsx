import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/msalConfig';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const bootstrap = async () => {
    try {
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();
        console.info("MSAL redirect response", response);
        if (response?.account) {
            msalInstance.setActiveAccount(response.account);
        }
    } catch (error) {
        console.error("MSAL redirect error", error);
    } finally {
        console.info("MSAL accounts", msalInstance.getAllAccounts());
        root.render(
            <React.StrictMode>
                <MsalProvider instance={msalInstance}>
                    <App />
                </MsalProvider>
            </React.StrictMode>
        );
    }
};

bootstrap();
