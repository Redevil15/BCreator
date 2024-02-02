"use client";

import * as z from 'zod'
import { Agency } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 } from 'uuid'

import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import FileUpload from '@/app/(main)/agency/_components/file-upload';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { NumberInput } from "@tremor/react"
import { saveActivityLogsNotification, updateAgencyDetails, deleteAgency, initUser, upsertAgency } from '@/lib/queries';
import Loading from '../loading';


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

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data])

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData
      let custId

      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zip,
              state: values.zip
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zip,
            state: values.zip
          }
        }

        const customerResponse = await fetch('api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        })
        const customerData: { customerId: string } = await customerResponse.json()
        custId = customerData.customerId
      }

      newUserData = await initUser({ role: 'AGENCY_OWNER' })

      if (!data?.customerId && !custId) return

      const response = await upsertAgency({
        id: data?.id ? data.id : v4(),
        customerId: data?.customerId || custId || '',
        address: values.address,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zip,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        connectAccountId: '',
        goal: 5,
      })

    } catch (error) {

    }
  }

  const handleDeleteAgency = async () => {
    if (!data?.id) return
    setDeletingAgency(true)
    // TODO: Discontinue the subscription

    try {
      const response = await deleteAgency(data.id)
      toast({
        title: 'Deleted Agency',
        description: 'Deleted your agency and all subaccounts',
      })
      router.refresh()
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'could not delete your agency ',
      })
    }
    setDeletingAgency(false)
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Agency Logo
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex md:flex-row gap-4'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        Agency Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Agency Name"
                          {...field}
                          type="text"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex md:flex-row gap-4'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        Agency phone number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder='Phone'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border gap-4 p-4'>
                      <div>
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription>
                          Turning on whitelabel mode will show tour agency logo to all sub accounts by default. You can overwrite this functionality through sub account settings.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="123 st..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex md:flex-row gap-4'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder='City'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder='State'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Zip
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Zipcode'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder='Country'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className='flex flex-col gap-2'>
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data.goal}
                    onValueChange={async (val: number) => {
                      if (!data.id) return
                      await updateAgencyDetails(data.id, { goal: val })
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Uptaded the agency goal to ${val} Sub Account`,
                        subaccountId: undefined
                      })
                      router.refresh()
                    }}
                    min={1}
                    className='bg-background !border !border-input'
                    placeholder='Sub Account Goal'
                  />
                </div>
              )}
              <Button
                disabled={isLoading}
                type='submit'
              >
                {isLoading ? <Loading /> : 'Save angency information'}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
              <div>
                <div>
                  Danger Zone
                </div>
              </div>
              <div className='text-muted-foreground'>
                Deleting your agency cannot be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading}
                className='text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap'
              >
                {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=''>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex items-center'>
              <AlertDialogCancel className='mb-2'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className='bg-destructive hover:bg-destructive'
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails