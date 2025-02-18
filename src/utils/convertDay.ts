
import { useTranslation } from "react-i18next";

const useConvertDayOfWeek = () => {
    const { t } = useTranslation();

    const convertDayOfWeek = (dayOfWeek: string): string => {
        return t(`days.${dayOfWeek}`, { defaultValue: dayOfWeek });
    };

    return { convertDayOfWeek };
};

export default useConvertDayOfWeek;
