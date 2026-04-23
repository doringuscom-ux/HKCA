import React from 'react'
import PageHero from '../components/layout/PageHero'
import DisciplinesList from '../components/Disciplines/DisciplinesList'
import { PageTransition } from '../components/common/Animations'

const DisciplinesPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#131b23] font-sans">
        <PageHero 
          subtitle="EXPLORE THE ACTION" 
          title="SPORTS DISCIPLINES" 
          height="h-[20vh]" 
        />
        <DisciplinesList />
      </div>
    </PageTransition>
  )
}

export default DisciplinesPage
