import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NotificationContextType {
    hasUnreadNotifications: boolean;
    setHasUnreadNotifications: (value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    return (
        <NotificationContext.Provider value={{ hasUnreadNotifications, setHasUnreadNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationStatus = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationStatus must be used within a NotificationProvider');
    }
    return context;
};