import React, {createContext, useState, ReactNode} from 'react';
interface SidebarContextProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}
export const SidebarContext = createContext<SidebarContextProps>({
    isSidebarOpen: true,
    toggleSidebar: () => {
    },
});
interface SidebarProviderProps {
    children: ReactNode;
}
export const SidebarProvider: React.FC<SidebarProviderProps> = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    return (
        <SidebarContext.Provider value={{isSidebarOpen, toggleSidebar}}>
            {children}
        </SidebarContext.Provider>
    );
};