import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, error }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState('1990');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedDay, setSelectedDay] = useState('1');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-');
      setSelectedYear(year);
      setSelectedMonth(String(parseInt(month, 10)));
      setSelectedDay(String(parseInt(day, 10)));
    }
  }, [value]);

  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const days = Array.from(
    { length: getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth)) },
    (_, i) => i + 1
  );

  const handleChange = (type: 'year' | 'month' | 'day', value: string) => {
    let yearVal = selectedYear;
    let monthVal = selectedMonth;
    let dayVal = selectedDay;

    switch (type) {
      case 'year':
        yearVal = value;
        break;
      case 'month':
        monthVal = value;
        break;
      case 'day':
        dayVal = value;
        break;
    }

    // Validate day based on month and year
    const maxDays = getDaysInMonth(parseInt(yearVal), parseInt(monthVal));
    if (parseInt(dayVal) > maxDays) {
      dayVal = String(maxDays);
    }

    const date = new Date(
      parseInt(yearVal),
      parseInt(monthVal) - 1,
      parseInt(dayVal)
    );

    setSelectedYear(yearVal);
    setSelectedMonth(monthVal);
    setSelectedDay(dayVal);

    onChange(format(date, 'yyyy-MM-dd'));
  };

  const selectClass = `
    w-full px-4 py-2.5 bg-primary-50 border border-primary-200 
    rounded-lg text-accent-800 focus:outline-none focus:ring-2 
    focus:ring-accent-800/20 appearance-none cursor-pointer 
    hover:bg-primary-100 transition-colors
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')]
    bg-[length:1.25rem] bg-no-repeat bg-[right_0.5rem_center]
    pr-10
  `;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <select
            value={selectedYear}
            onChange={(e) => handleChange('year', e.target.value)}
            className={selectClass}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedMonth}
            onChange={(e) => handleChange('month', e.target.value)}
            className={selectClass}
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDay}
            onChange={(e) => handleChange('day', e.target.value)}
            className={selectClass}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {String(day).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      <div className="text-sm text-accent-600 bg-primary-50/50 px-4 py-2 rounded-lg">
        Selected: {format(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, parseInt(selectedDay)), 'yyyy-MM-dd')}
      </div>
    </div>
  );
};

export default CustomDatePicker;