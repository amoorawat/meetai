import { Loader2Icon } from 'lucide-react'
import React from 'react'

interface Props {
    title: string
    description: string
}

export const LoadingState = ({title, description}: Props) => {
  return (
    <div className='py-3 px-6 flex flex-1 items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-4 shadow-sm'>
            <Loader2Icon className='size-6 animate-spin text-primary' />
            <div className='flex flex-col  gap-y-2 text-center'>
                <h1 className='text-lg font-medium'>{title}</h1>
                <p className='text-sm text-accent-foreground'>{description}</p>
            </div>

        </div>
    </div>
  )
}
