import React from 'react'
import PageHero from '../components/layout/PageHero'
import DownloadsContent from '../components/Downloads/DownloadsContent'

const DownloadsPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Resources" 
        title="DOWNLOADS" 
        height="h-[30vh]" 
      />
      <DownloadsContent />
    </div>
  )
}

export default DownloadsPage
