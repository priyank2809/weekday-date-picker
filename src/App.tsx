import React from 'react';
import WeekdayDateRangePicker from './components/WeekdayDateRangePicker';

function App() {
  const handleDateRangeChange = (dateRange: [Date, Date], weekends: Date[]) => {
    console.log('Selected date range:', dateRange);
    console.log('Weekend dates in range:', weekends);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <WeekdayDateRangePicker
        onChange={handleDateRangeChange}
      />
    </div>
  );
}

export default App;