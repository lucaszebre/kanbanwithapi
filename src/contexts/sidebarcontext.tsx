    import {create} from 'zustand';

    type SidebarStore = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isSidebarMobile: boolean;
    setIsSidebarMobile: (isMobile: boolean) => void;
    };

    export const useSidebarStore = create<SidebarStore>((set) => ({
    isSidebarOpen: true,
    setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    isSidebarMobile: true,
    setIsSidebarMobile: (isMobile) => set({ isSidebarMobile: isMobile }),
    }));

