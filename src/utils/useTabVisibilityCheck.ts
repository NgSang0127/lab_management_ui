// useUserActivityCheck.ts
import { useAppDispatch } from "../state/store.ts";
import { useEffect, useRef, useCallback } from "react";
import { API_URL } from "../config/api.ts";
import { endSession } from "../state/User/Reducer.ts";

const useUserActivityCheck = () => {
    const dispatch = useAppDispatch();
    const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);


    const sendEndSessionRequest = useCallback(() => {
        const url = `${API_URL}/user-activity/end-session`;

        // Lấy JWT từ localStorage
        const token = localStorage.getItem('accessToken');
        const data = JSON.stringify({ token });

        if (navigator.sendBeacon) {
            const blob = new Blob([data], { type: 'application/json' });
            const success = navigator.sendBeacon(url, blob);
            console.log('sendBeacon success:', success);
        } else {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                credentials: 'include',
                keepalive: true,
            }).then(response => {
                console.log('Fetch response:', response);
            }).catch((error) => {
                console.error('Error ending session:', error);
            });
        }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }

        inactivityTimeout.current = setTimeout(() => {
            sendEndSessionRequest();
            dispatch(endSession());
        }, 30 * 60 * 1000);
    }, [dispatch, sendEndSessionRequest]);

    const handlePageHide = useCallback(() => {
        console.log('Page is being hidden or unloaded.');
        sendEndSessionRequest();
    }, [sendEndSessionRequest]);

    useEffect(() => {
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        window.addEventListener('pagehide', handlePageHide);

        // Đặt bộ đếm thời gian ban đầu
        resetInactivityTimer();


        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            window.removeEventListener('pagehide', handlePageHide);

            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
        };
    }, [resetInactivityTimer, handlePageHide]);

};

export default useUserActivityCheck;
