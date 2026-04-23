import React from 'react'
import PageHero from '../components/layout/PageHero'
import ServiceContent from '../components/Service/ServiceContent'

const ServicePage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Professional Excellence" 
        title="OUR SERVICES" 
        height="h-[30vh]" 
      />
      <ServiceContent />
    </div>
  )
}

export default ServicePage
