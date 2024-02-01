"use client";

import * as z from 'zod'
import { Agency } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast'
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import FileUpload from '@/app/(main)/agency/_components/file-upload';


type AgencyProps = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Agency name must be at least 2 chracters long'
  }),
  companyEmail: z.string().email({
    message: 'Please enter a valid email address'
  }),
  companyPhone: z.string().min(10, {
    message: 'Please enter a valid phone number'
  }),
  whiteLabel: z.boolean(),
  address: z.string().min(5, {
    message: 'Please enter a valid address'
  }),
  city: z.string().min(2, {
    message: 'Please enter a valid city'
  }),
  state: z.string().min(2, {
    message: 'Please enter a valid state'
  }),
  zip: z.string().min(5, {
    message: 'Please enter a valid zip code'
  }),
  country: z.string().min(2, {
    message: 'Please enter a valid country'
  }),
  agencyLogo: z.string().min(1)
})

const AgencyDetails = ({
  data
}: AgencyProps) => {
  const { toast } = useToast();
  const router = useRouter()

  const [deletingAgency, setDeletingAgency] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || '',
      companyEmail: data?.companyEmail || '',
      companyPhone: data?.companyPhone || '',
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || '',
      city: data?.city || '',
      state: data?.state || '',
      zip: data?.zip || '',
      country: data?.country || '',
      agencyLogo: data?.agencyLogo || ''
    }
  })

  const { isLoading } = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data])

  const handleSubmit = async () => {
    console.log('submitting')
  }


  return (
    <AlertDialog>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>
            Agency Informacion
          </CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Agency Logo
                    </FormLabel>
                    <FormControl>
                      <FileUpload

                      >

                      </FileUpload>
                    </FormControl>
                  </FormItem>
                )}
              >

              </FormField>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails