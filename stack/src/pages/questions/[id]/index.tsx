import React from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { useRouter } from 'next/router';
import QuestionDetail from '@/components/QuestionDetail';

const index = () => {
    const router = useRouter();
    const { id } = router.query;
  return (
    <MainLayout>
      <div className="min-h-screen overflow-auto">
        <QuestionDetail questionId={Array.isArray(id) ? id[0] : id} />
      </div>
    </MainLayout>
  )
}

export default index
