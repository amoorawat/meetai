
import { AlertCircleIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface Props {
    title: string
    description: string
}

export const EmptyState = ({title, description}: Props) => {
  return (
    <div className='flex flex-col items-center justify-center'>       
            <Image src="/emptylogo.svg" alt='Empty' width={240} height={240} />
            <div className='flex flex-col  gap-y-6 max-w-md mx-auto text-center'>
                <h1 className='text-lg font-medium'>{title}</h1>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
    </div>
  )
}
