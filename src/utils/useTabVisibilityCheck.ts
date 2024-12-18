
import {useAppDispatch} from "../state/store.ts";
import {useEffect, useRef} from "react";
import {endSession} from "../state/User/Reducer.ts";

const useUserActivityCheck = () => {
    const dispatch = useAppDispatch();
    const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Hàm để reset bộ đếm thời gian khi có hành động từ người dùng
    const resetInactivityTimer = () => {
        // Xóa bộ đếm thời gian cũ nếu có
        if (inactivityTimeout.current) {
            clearTimeout(inactivityTimeout.current);
        }

        // Thiết lập lại bộ đếm thời gian mới (30 phút)
        inactivityTimeout.current = setTimeout(() => {
            dispatch(endSession()); // Gửi action kết thúc phiên sau 30 phút không hoạt động
        }, 30 * 60 * 1000); // 30 phút
    };

    // Hàm để xử lý khi người dùng cố gắng đóng tab
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        dispatch(endSession());
    };

    useEffect(() => {
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup khi component unmount
        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            window.removeEventListener('beforeunload', handleBeforeUnload);

            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current); // Dọn dẹp bộ đếm thời gian khi component unmount
            }
        };
    }, [dispatch]);

    useEffect(() => {
        resetInactivityTimer();
    }, []);

};

export default useUserActivityCheck;
