export interface DateRangePickerProps {
    predefinedRanges?: {
        label: string;
        range: [Date, Date];
    }[];
    onChange?: (dateRange: [Date, Date], weekends: Date[]) => void;
}

export interface CalendarState {
    month: number;
    year: number;
}