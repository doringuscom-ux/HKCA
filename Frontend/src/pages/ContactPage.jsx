import React from 'react'
import PageHero from '../components/layout/PageHero'
import ContactContent from '../components/Contact/ContactContent'

const ContactPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Get In Touch" 
        title="CONTACT US" 
        height="h-[30vh]" 
      />
      <ContactContent />
    </div>
  )
}

export default ContactPage
