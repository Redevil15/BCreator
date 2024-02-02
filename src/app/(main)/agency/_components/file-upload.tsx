import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/lib/uploadthing'
import { FileIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type FileUploadProps = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo"
  onChange: (url?: string) => void
  value?: string
}

const FileUpload = ({
  apiEndpoint,
  onChange,
  value
}: FileUploadProps) => {
  const type = value?.split('.').pop();

  if (value) {
    return (
      <div className='flex flex-col justify-center items-center'>
        {type !== 'pdf' ? (
          <div className='relative w-40 h-40'>
            <Image
              src={value}
              fill
              className='object-container'
              alt="Uploaded image"
            />
          </div>
        ) : (
          <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
            <FileIcon />
            <a
              href={value}
              target='_blank'
              rel="noopener_noreferrer"
              className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
            >
              View pdf
            </a>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange('')}
        >
          <XIcon className='h-4 w-4' />
          Remove Logo
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full bg-muted/30'>
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url)
        }}
        onUploadError={(err: Error) => {
          console.log(err)
        }}
      />
    </div>
  )
}

export default FileUpload