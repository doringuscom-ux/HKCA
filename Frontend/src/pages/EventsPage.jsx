import React from 'react'
import PageHero from '../components/layout/PageHero'
import EventsContent from '../components/Events/EventsContent'

const EventsPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Stay Updated" 
        title="EVENTS" 
        height="h-[30vh]" 
      />
      <EventsContent />
    </div>
  )
}

export default EventsPage
