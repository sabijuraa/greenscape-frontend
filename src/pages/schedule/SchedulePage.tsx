import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, Avatar, Modal } from '../../components/ui/Icons';

interface ScheduleEvent {
  id: string;
  type: 'site_visit' | 'project_work' | 'delivery' | 'meeting';
  title: string;
  project_id?: string;
  project_name?: string;
  client_name?: string;
  address?: string;
  date: string;
  start_time: string;
  end_time: string;
  assigned_to: string[];
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    type: 'project_work',
    title: 'Patio Installation',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    address: '42 Oak Lane, Richmond',
    date: '2025-01-03',
    start_time: '08:00',
    end_time: '16:00',
    assigned_to: ['John Smith', 'Tom Brown'],
    status: 'in_progress',
  },
  {
    id: '2',
    type: 'site_visit',
    title: 'Site Survey',
    project_id: '5',
    project_name: 'Wilson Lawn Renovation',
    client_name: 'David Wilson',
    address: '56 Birch Road, Surbiton',
    date: '2025-01-03',
    start_time: '10:00',
    end_time: '11:30',
    assigned_to: ['Sarah Johnson'],
    notes: 'Measure lawn area and assess drainage',
    status: 'scheduled',
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Material Delivery',
    project_id: '6',
    project_name: 'Brown Patio Extension',
    address: '12 Elm Drive, Esher',
    date: '2025-01-04',
    start_time: '09:00',
    end_time: '10:00',
    assigned_to: ['Mike Johnson'],
    notes: 'Paving slabs and sand - confirm delivery slot',
    status: 'confirmed',
  },
  {
    id: '4',
    type: 'project_work',
    title: 'Site Preparation',
    project_id: '6',
    project_name: 'Brown Patio Extension',
    client_name: 'Lisa Brown',
    address: '12 Elm Drive, Esher',
    date: '2025-01-06',
    start_time: '08:00',
    end_time: '15:00',
    assigned_to: ['John Smith'],
    status: 'scheduled',
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Design Review Meeting',
    project_id: '4',
    project_name: 'Henderson Complete Garden Design',
    client_name: 'Emily Henderson',
    address: 'Video Call',
    date: '2025-01-05',
    start_time: '14:00',
    end_time: '15:00',
    assigned_to: ['Emma Wilson', 'Sarah Johnson'],
    notes: 'Review design revision v3 with client',
    status: 'scheduled',
  },
];

const typeConfig = {
  site_visit: { label: 'Site Visit', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-700' },
  project_work: { label: 'Project Work', color: 'bg-sage-500', lightColor: 'bg-sage-100', textColor: 'text-sage-700' },
  delivery: { label: 'Delivery', color: 'bg-amber-500', lightColor: 'bg-amber-100', textColor: 'text-amber-700' },
  meeting: { label: 'Meeting', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-700' },
};

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  in_progress: { label: 'In Progress', color: 'text-sage-600', bgColor: 'bg-sage-100' },
  completed: { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
};

const SchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Get week dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date().toISOString().split('T')[0];

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => event.date === date);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const weekRange = `${weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-gray-500 mt-1">Manage site visits, deliveries, and project work</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-sage-700 transition-colors"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* Calendar Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icons.ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icons.ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{weekRange}</h2>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-sage-600 hover:bg-sage-50 rounded-lg"
            >
              Today
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden lg:flex items-center gap-4">
              {Object.entries(typeConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
              ))}
            </div>
            
            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 text-sm font-medium ${viewMode === 'day' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-sm font-medium ${viewMode === 'week' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium ${viewMode === 'list' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      {viewMode === 'week' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDates.map((date) => {
              const dateStr = formatDate(date);
              const isToday = dateStr === today;
              const dayEvents = getEventsForDate(dateStr);
              
              return (
                <div 
                  key={dateStr}
                  className={`border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-sage-50' : ''}`}
                >
                  {/* Day Header */}
                  <div className={`p-3 text-center border-b border-gray-100 ${isToday ? 'bg-sage-100' : 'bg-gray-50'}`}>
                    <p className="text-xs text-gray-500 uppercase">
                      {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </p>
                    <p className={`text-xl font-semibold mt-1 ${isToday ? 'text-sage-700' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </p>
                  </div>
                  
                  {/* Events */}
                  <div className="p-2 min-h-[200px] space-y-2">
                    {dayEvents.map((event) => {
                      const type = typeConfig[event.type];
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left p-2 rounded-lg ${type.lightColor} hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                            <span className={`text-xs font-medium ${type.textColor}`}>
                              {formatTime(event.start_time)}
                            </span>
                          </div>
                          <p className={`text-sm font-medium ${type.textColor} truncate`}>
                            {event.title}
                          </p>
                          {event.project_name && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {event.project_name}
                            </p>
                          )}
                        </button>
                      );
                    })}
                    {dayEvents.length === 0 && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-gray-400">No events</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {weekDates.map((date) => {
            const dateStr = formatDate(date);
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === today;
            
            if (dayEvents.length === 0) return null;
            
            return (
              <div key={dateStr}>
                <h3 className={`text-sm font-semibold mb-3 ${isToday ? 'text-sage-600' : 'text-gray-700'}`}>
                  {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {isToday && <span className="ml-2 text-sage-600">(Today)</span>}
                </h3>
                <div className="space-y-3">
                  {dayEvents.map((event) => {
                    const type = typeConfig[event.type];
                    const status = statusConfig[event.status];
                    
                    return (
                      <Card 
                        key={event.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex gap-4">
                          <div className={`w-1.5 rounded-full ${type.color}`}></div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium ${type.textColor} ${type.lightColor} px-2 py-0.5 rounded`}>
                                    {type.label}
                                  </span>
                                  <span className={`text-xs font-medium ${status.color} ${status.bgColor} px-2 py-0.5 rounded`}>
                                    {status.label}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                {event.project_name && (
                                  <p className="text-sm text-gray-600 mt-1">{event.project_name}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              {event.address && (
                                <div className="flex items-center gap-1">
                                  <Icons.MapPin className="w-4 h-4" />
                                  {event.address}
                                </div>
                              )}
                              {event.client_name && (
                                <div className="flex items-center gap-1">
                                  <Icons.User className="w-4 h-4" />
                                  {event.client_name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {event.assigned_to.map((person, idx) => (
                                <Avatar key={idx} name={person} size="sm" />
                              ))}
                              <span className="text-sm text-gray-500">
                                {event.assigned_to.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'day' && (
        <Card>
          <div className="text-center py-8">
            <Icons.Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Day view coming soon</p>
            <p className="text-sm text-gray-400 mt-1">Switch to Week or List view</p>
          </div>
        </Card>
      )}

      {/* Event Detail Modal */}
      <Modal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeConfig[selectedEvent.type].lightColor}`}>
                {selectedEvent.type === 'site_visit' && <Icons.MapPin className={`w-6 h-6 ${typeConfig[selectedEvent.type].textColor}`} />}
                {selectedEvent.type === 'project_work' && <Icons.Tool className={`w-6 h-6 ${typeConfig[selectedEvent.type].textColor}`} />}
                {selectedEvent.type === 'delivery' && <Icons.Briefcase className={`w-6 h-6 ${typeConfig[selectedEvent.type].textColor}`} />}
                {selectedEvent.type === 'meeting' && <Icons.Users className={`w-6 h-6 ${typeConfig[selectedEvent.type].textColor}`} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${typeConfig[selectedEvent.type].textColor} ${typeConfig[selectedEvent.type].lightColor} px-2 py-0.5 rounded`}>
                    {typeConfig[selectedEvent.type].label}
                  </span>
                  <span className={`text-xs font-medium ${statusConfig[selectedEvent.status].color} ${statusConfig[selectedEvent.status].bgColor} px-2 py-0.5 rounded`}>
                    {statusConfig[selectedEvent.status].label}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedEvent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                </p>
              </div>
            </div>

            {selectedEvent.project_name && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Project</p>
                <Link 
                  to={`/projects/${selectedEvent.project_id}`}
                  className="font-medium text-sage-600 hover:text-sage-700"
                >
                  {selectedEvent.project_name}
                </Link>
              </div>
            )}

            {selectedEvent.client_name && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Client</p>
                <p className="font-medium text-gray-900">{selectedEvent.client_name}</p>
              </div>
            )}

            {selectedEvent.address && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-medium text-gray-900">{selectedEvent.address}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-2">Assigned To</p>
              <div className="flex items-center gap-2">
                {selectedEvent.assigned_to.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Avatar name={person} size="sm" />
                    <span className="text-sm font-medium text-gray-700">{person}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedEvent.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{selectedEvent.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                <Icons.Edit className="w-4 h-4 inline mr-2" />
                Edit
              </button>
              {selectedEvent.status !== 'completed' && (
                <button className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700">
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Event Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Event" size="lg">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select className="input">
              <option value="site_visit">Site Visit</option>
              <option value="project_work">Project Work</option>
              <option value="delivery">Delivery</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" className="input" placeholder="Enter event title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>
            <select className="input">
              <option value="">Select project</option>
              <option value="1">Thompson Garden Renovation</option>
              <option value="4">Henderson Complete Garden Design</option>
              <option value="6">Brown Patio Extension</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input type="time" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                <input type="time" className="input" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" className="input" placeholder="Enter address or location" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="input" rows={3} placeholder="Add any notes" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulePage;