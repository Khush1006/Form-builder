import DeclarationForm from '@/components/form-builder/Form'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading dynamic component...</div>}>
      <DeclarationForm />
    </Suspense>
  )
}

export default page
