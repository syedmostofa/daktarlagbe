import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function CalendarPicker({ selected, onChange }) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none z-10">
        <Calendar size={16} />
      </div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={new Date()}
        maxDate={addDays(new Date(), 30)}
        placeholderText="Select a date"
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
        dateFormat="dd MMM yyyy"
        filterDate={(date) => date.getDay() !== 5}
      />
    </div>
  );
}
