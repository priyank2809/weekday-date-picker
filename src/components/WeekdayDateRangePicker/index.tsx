import React, { useState, useEffect } from 'react';
import { DateRangePickerProps, CalendarState } from './types';

const WeekdayDateRangePicker: React.FC<DateRangePickerProps> = ({
    predefinedRanges = [],
    onChange
}) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const [leftCalendar, setLeftCalendar] = useState<CalendarState>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const [rightCalendar, setRightCalendar] = useState<CalendarState>({
        month: new Date().getMonth() + 1 > 11 ? 0 : new Date().getMonth() + 1,
        year: new Date().getMonth() + 1 > 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()
    });

    const isWeekend = (date: Date | null): boolean => {
        if (!date) return false;
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getDatesBetween = (start: Date, end: Date): Date[] => {
        const dates: Date[] = [];
        let current = new Date(start);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const getWeekendDates = (start: Date, end: Date): Date[] => {
        return getDatesBetween(start, end).filter(date => isWeekend(date));
    };

    const isInRange = (date: Date | null): boolean => {
        if (!date || !startDate || !endDate) return false;

        const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const compareStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
        const compareEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
        
        return compareDate >= compareStart && compareDate <= compareEnd;
    };

    const handleDateClick = (date: Date | null) => {
        if (!date || isWeekend(date)) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else {
            if (date < startDate) {
                setStartDate(date);
                setEndDate(startDate);
            } else {
                setEndDate(date);
            }
        }
    };

    useEffect(() => {
        if (startDate && endDate && onChange) {
            const weekends = getWeekendDates(startDate, endDate);
            onChange([startDate, endDate], weekends);
        }
    }, [startDate, endDate, onChange]);

    const generateCalendarGrid = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const grid: (Date | null)[] = [];

        for (let i = 0; i < startingDay; i++) {
            grid.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            grid.push(new Date(year, month, day));
        }

        const remainingCells = 42 - grid.length;
        for (let i = 0; i < remainingCells; i++) {
            grid.push(null);
        }

        return grid;
    };

    const navigateMonth = (direction: 'prev' | 'next', calendar: 'left' | 'right') => {
        const targetCalendar = calendar === 'left' ? leftCalendar : rightCalendar;
        const setTargetCalendar = calendar === 'left' ? setLeftCalendar : setRightCalendar;

        let newMonth = targetCalendar.month;
        let newYear = targetCalendar.year;

        if (direction === 'prev') {
            newMonth--;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
        } else {
            newMonth++;
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
        }

        setTargetCalendar({ month: newMonth, year: newYear });
    };

    const formatDateRange = () => {
        if (!startDate && !endDate) return 'MM/dd/yyyy ~ MM/dd/yyyy';
        if (startDate && !endDate) {
            return `${startDate.toLocaleDateString()} ~ MM/dd/yyyy`;
        }
        return `${startDate?.toLocaleDateString()} ~ ${endDate?.toLocaleDateString()}`;
    };

    const getPreviousWeekday = (date: Date): Date => {
        const prev = new Date(date);
        while (isWeekend(prev)) {
            prev.setDate(prev.getDate() - 1);
        }
        return prev;
    };

    const handleLastSevenDays = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        
        setStartDate(start);
        setEndDate(end);
    };

    const handleLastThirtyDays = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        
        setStartDate(start);
        setEndDate(end);
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div
                className="w-full border rounded p-2 cursor-pointer bg-white"
                onClick={() => setShowCalendar(!showCalendar)}
            >
                {formatDateRange()}
            </div>

            {showCalendar && (
                <div className="absolute left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex gap-8">

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => navigateMonth('prev', 'left')}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    ←
                                </button>
                                <span className="font-medium">
                                    {new Date(leftCalendar.year, leftCalendar.month).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                                <button
                                    onClick={() => navigateMonth('next', 'left')}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    →
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-xs font-medium p-2 text-gray-500">
                                        {day}
                                    </div>
                                ))}
                                {generateCalendarGrid(leftCalendar.month, leftCalendar.year).map((date, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            text-center py-2 text-sm rounded-full
                                            ${!date ? 'invisible' : ''}
                                            ${date && isWeekend(date) ? 'text-gray-300' : 'cursor-pointer'}
                                            ${date && isInRange(date) && !isWeekend(date) ? 'bg-blue-500 text-white' : ''}
                                            ${date && !isWeekend(date) && !isInRange(date) ? 'hover:bg-gray-100' : ''}
                                        `}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date?.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => navigateMonth('prev', 'right')}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    ←
                                </button>
                                <span className="font-medium">
                                    {new Date(rightCalendar.year, rightCalendar.month).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                                <button
                                    onClick={() => navigateMonth('next', 'right')}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    →
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-xs font-medium p-2 text-gray-500">
                                        {day}
                                    </div>
                                ))}
                                {generateCalendarGrid(rightCalendar.month, rightCalendar.year).map((date, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            text-center py-2 text-sm rounded-full
                                            ${!date ? 'invisible' : ''}
                                            ${date && isWeekend(date) ? 'text-gray-300' : 'cursor-pointer'}
                                            ${date && isInRange(date) && !isWeekend(date) ? 'bg-blue-500 text-white' : ''}
                                            ${date && !isWeekend(date) && !isInRange(date) ? 'hover:bg-gray-100' : ''}
                                        `}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date?.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div className="flex space-x-4">
                            <button
                                className="text-blue-500 hover:underline text-sm"
                                onClick={handleLastSevenDays}
                            >
                                Last 7 days
                            </button>
                            <button
                                className="text-blue-500 hover:underline text-sm"
                                onClick={handleLastThirtyDays}
                            >
                                Last 30 days
                            </button>
                            <button
                                className="text-blue-500 hover:underline text-sm"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                        </div>
                        <button
                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setShowCalendar(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeekdayDateRangePicker;