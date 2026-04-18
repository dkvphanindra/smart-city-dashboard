// Real events data for Indian cities (based on actual event patterns)
export const getRealisticEvents = (state) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Seasonal events based on month
  const seasonalEvents = {
    '1': ['Republic Day Celebrations', 'Winter Music Festival', 'New Year Expo'],
    '2': ['Valentines Day Concert', 'Tech Summit', 'Food Festival'],
    '3': ['Holi Festival', 'Spring Art Exhibition', 'Cricket Tournament'],
    '4': ['Summer Music Fest', 'Startup Conference', 'Cultural Mela'],
    '5': ['International Film Festival', 'Book Fair', 'Yoga Retreat'],
    '6': ['Monsoon Festival', 'IT Conference', 'Photography Exhibition'],
    '7': ['Independence Day Events', 'Rain Dance Party', 'Tech Workshop'],
    '8': ['Raksha Bandhan Celebrations', 'Art & Craft Fair', 'Music Concert'],
    '9': ['Ganesh Chaturthi Festival', 'Fashion Week', 'Food Carnival'],
    '10': ['Diwali Celebrations', 'Navratri Garba Night', 'Trade Fair'],
    '11': ['Childrens Day Festival', 'Marathon Event', 'Tech Expo'],
    '12': ['Christmas Carnival', 'New Year Eve Bash', 'Winter Sports'],
  };

  // State-specific major events
  const stateSpecificEvents = {
    MH: [
      { name: 'Mumbai Film Festival', type: 'Entertainment', typicalMonth: 10, venue: 'NESCO Mumbai' },
      { name: 'Elephanta Festival', type: 'Cultural', typicalMonth: 2, venue: 'Elephanta Caves' },
      { name: 'Pune Jazz Festival', type: 'Music', typicalMonth: 1, venue: 'Pune' },
      { name: 'Bollywood Concert', type: 'Concert', typicalMonth: 12, venue: 'Mumbai Arena' },
    ],
    DL: [
      { name: 'Delhi International Arts Festival', type: 'Cultural', typicalMonth: 11, venue: 'India Habitat Centre' },
      { name: 'India International Trade Fair', type: 'Exhibition', typicalMonth: 11, venue: 'Pragati Maidan' },
      { name: 'Delhi Food Festival', type: 'Festival', typicalMonth: 1, venue: 'Jawaharlal Nehru Stadium' },
      { name: 'Concert at JLN Stadium', type: 'Concert', typicalMonth: 2, venue: 'JLN Stadium' },
    ],
    KA: [
      { name: 'Bengaluru Tech Summit', type: 'Conference', typicalMonth: 5, venue: 'Palace Grounds' },
      { name: 'Bangalore Open Air', type: 'Music', typicalMonth: 3, venue: 'Bangalore Palace' },
      { name: 'Karnataka Rajyotsava', type: 'Festival', typicalMonth: 11, venue: 'Throughout Karnataka' },
      { name: 'Startup Conference', type: 'Conference', typicalMonth: 6, venue: 'SIAM Bangalore' },
    ],
    TN: [
      { name: 'Chennai Music Season', type: 'Music', typicalMonth: 12, venue: 'Multiple Venues' },
      { name: 'Pongal Celebrations', type: 'Festival', typicalMonth: 1, venue: 'Throughout TN' },
      { name: 'Chennai International Film Fest', type: 'Entertainment', typicalMonth: 12, venue: 'Satyam Cinemas' },
      { name: 'Marina Beach Concert', type: 'Concert', typicalMonth: 2, venue: 'Marina Beach' },
    ],
    GJ: [
      { name: 'Navratri Celebrations', type: 'Festival', typicalMonth: 10, venue: 'Throughout Gujarat' },
      { name: 'Rann Utsav', type: 'Cultural', typicalMonth: 11, venue: 'Rann of Kutch' },
      { name: 'Surat Diamond Festival', type: 'Exhibition', typicalMonth: 2, venue: 'Surat' },
      { name: 'Ahmedabad Food Fest', type: 'Festival', typicalMonth: 1, venue: 'Riverfront' },
    ],
    RJ: [
      { name: 'Desert Festival Jaisalmer', type: 'Cultural', typicalMonth: 2, venue: 'Jaisalmer' },
      { name: 'Jaipur Literature Festival', type: 'Conference', typicalMonth: 1, venue: 'Diggi Palace' },
      { name: 'Teej Festival', type: 'Festival', typicalMonth: 8, venue: 'Jaipur' },
      { name: 'Rajasthan Heritage Tour', type: 'Exhibition', typicalMonth: 3, venue: 'Udaipur' },
    ],
    default: [
      { name: 'State Cultural Festival', type: 'Festival', typicalMonth: currentMonth, venue: state.capital },
      { name: 'Tech Conference', type: 'Conference', typicalMonth: currentMonth, venue: state.capital },
      { name: 'Music Concert', type: 'Concert', typicalMonth: currentMonth, venue: state.capital },
      { name: 'Food Carnival', type: 'Festival', typicalMonth: currentMonth, venue: state.capital },
    ],
  };

  // Get state-specific events
  const stateEvents = stateSpecificEvents[state.id] || stateSpecificEvents.default;
  
  // Generate events for current/next month
  const events = stateEvents
    .filter(event => {
      const monthDiff = event.typicalMonth - currentMonth;
      return monthDiff >= 0 && monthDiff <= 2; // Show events in next 2 months
    })
    .map((event, index) => {
      const eventDate = new Date(currentDate);
      eventDate.setMonth(currentMonth + Math.floor(Math.random() * 2) - 1);
      eventDate.setDate(Math.floor(Math.random() * 28) + 1);
      
      return {
        id: index + 1,
        type: event.type,
        name: event.name,
        location: {
          name: event.venue,
          lat: state.center[0] + (Math.random() - 0.5) * 0.1,
          lng: state.center[1] + (Math.random() - 0.5) * 0.1,
        },
        attendees: Math.floor(Math.random() * 5000) + 1000,
        startTime: `${Math.floor(Math.random() * 12) + 9}:00`,
        status: eventDate < currentDate ? 'Ongoing' : 'Upcoming',
        date: eventDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        ticketPrice: event.type === 'Concert' ? '₹500-2000' : event.type === 'Conference' ? '₹1000-5000' : 'Free',
      };
    });

  // Add generic seasonal events
  const seasonal = seasonalEvents[currentMonth] || [];
  seasonal.slice(0, 2).forEach((eventName, index) => {
    events.push({
      id: events.length + 1,
      type: 'Festival',
      name: eventName,
      location: {
        name: `${state.capital} Convention Center`,
        lat: state.center[0] + (Math.random() - 0.5) * 0.05,
        lng: state.center[1] + (Math.random() - 0.5) * 0.05,
      },
      attendees: Math.floor(Math.random() * 3000) + 500,
      startTime: `${Math.floor(Math.random() * 12) + 10}:00`,
      status: 'Upcoming',
      date: new Date(currentDate.setDate(currentDate.getDate() + Math.random() * 30)).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      ticketPrice: '₹200-1000',
    });
  });

  return events.slice(0, 6); // Return max 6 events
};

// Get event details (simulating API call)
export const getEventDetails = async (eventId, state) => {
  const events = getRealisticEvents(state);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return null;
  
  return {
    ...event,
    description: `Join us for ${event.name} at ${event.location.name}. This is one of the biggest ${event.type.toLowerCase()} events in ${state.name} with over ${event.attendees.toLocaleString()} attendees expected.`,
    organizer: `${state.name} Events Association`,
    contactEmail: `info@${state.name.toLowerCase()}events.com`,
    website: `www.${state.name.toLowerCase()}events.com/${event.id}`,
    amenities: ['Parking', 'Food Courts', 'First Aid', 'WiFi'],
  };
};

// Search events by type
export const searchEvents = (state, eventType) => {
  const events = getRealisticEvents(state);
  if (!eventType || eventType === 'All') return events;
  
  return events.filter(event => event.type === eventType);
};
