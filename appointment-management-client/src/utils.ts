import { format } from "date-fns";

export const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return format(date, "EEE, MMM d, yyyy 'at' HH:mm");
};