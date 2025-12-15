import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Tags from '@/components/Tags'

const index = () => {
  return (
    <MainLayout>
      <div className="min-h-screen overflow-auto">
        <Tags />
      </div>
    </MainLayout>
  )
}

export default index