import React from 'react'
import PageHero from '../components/layout/PageHero'
import GalleryContent from '../components/Gallery/GalleryContent'

const GalleryPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Visual Journey" 
        title="OUR GALLERY" 
        height="h-[30vh]" 
      />
      <GalleryContent />
    </div>
  )
}

export default GalleryPage
