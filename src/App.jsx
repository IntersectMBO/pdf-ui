'use client';

import { BrowserRouter } from 'react-router-dom';
import { GlobalWrapper, ThemeProviderWrapper } from './components';
import { AppContextProvider } from './context/context';

function App({ ...props }) {
    return (
        <div
            className='App'
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <AppContextProvider>
                <BrowserRouter>
                    <ThemeProviderWrapper>
                        <GlobalWrapper {...props} />
                    </ThemeProviderWrapper>
                </BrowserRouter>
            </AppContextProvider>
        </div>
    );
}

export default App;
