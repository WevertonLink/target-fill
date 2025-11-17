import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  selectedDate?: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export default function DatePicker({ selectedDate, onSelect, onClose }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelect(selected.toISOString().split('T')[0]);
    onClose();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const selectedDay = selectedDate ? new Date(selectedDate).getDate() : null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[70]">
      <div className="bg-zinc-900 rounded-lg max-w-sm w-full border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gold-500/20 border border-gold-500">
              <Calendar className="text-gold-400" size={20} />
            </div>
            <h3 className="font-bold text-white text-lg">Selecione a Data</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Month/Year Selector */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-800 rounded-md">
            <ChevronLeft className="text-zinc-400" size={20} />
          </button>
          <span className="font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-800 rounded-md">
            <ChevronRight className="text-zinc-400" size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const isToday = 
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              const isSelected = day === selectedDay &&
                currentDate.getMonth() === new Date(selectedDate!).getMonth() &&
                currentDate.getFullYear() === new Date(selectedDate!).getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gold-500 text-black'
                      : isToday
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-zinc-800 flex gap-2">
          <button
            onClick={() => {
              onSelect('');
              onClose();
            }}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg"
          >
            Limpar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-black py-2 rounded-lg font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
