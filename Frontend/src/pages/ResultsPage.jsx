import React from 'react'
import PageHero from '../components/layout/PageHero'
import ResultsContent from '../components/Results/ResultsContent'

const ResultsPage = () => {
  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Official Records" 
        title="CHAMPIONSHIP RESULTS" 
        height="h-[30vh]" 
      />
      <ResultsContent />
    </div>
  )
}

export default ResultsPage
