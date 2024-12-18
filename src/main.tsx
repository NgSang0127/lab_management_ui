import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {Provider} from 'react-redux';
import { RouterProvider} from 'react-router-dom';
import {ThemeContextProvider} from './theme/ThemeContext.tsx';
import {store} from "./state/store.ts";
import router from "./route/Routes.tsx";
import '@fontsource/roboto/400.css';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeContextProvider>
                <RouterProvider router={router}/>
            </ThemeContextProvider>
        </Provider>
    </StrictMode>
);
