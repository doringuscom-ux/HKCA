import React from 'react'
import { useParams } from 'react-router-dom'
import PageHero from '../components/layout/PageHero'
import DisciplineDetailsContent from '../components/Disciplines/DisciplineDetailsContent'

const DisciplineDetails = () => {
  const { slug } = useParams()
  
  // Convert slug back to title (e.g., "canoe-sprint" -> "CANOE SPRINT")
  const displayTitle = slug
    ? slug.replace(/-/g, ' ').toUpperCase()
    : 'DISCIPLINE'

  return (
    <div className="font-sans">
      <PageHero 
        subtitle="Sports Discipline" 
        title={displayTitle} 
        height="h-[30vh]" 
      />
      <DisciplineDetailsContent slug={slug} displayTitle={displayTitle} />
    </div>
  )
}

export default DisciplineDetails
