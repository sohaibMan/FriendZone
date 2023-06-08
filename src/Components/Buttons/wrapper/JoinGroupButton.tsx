'use client'

import {addFriendValidator} from '@/lib/validations/add-friend'
import axios, {AxiosError} from 'axios'
import {FC, useState} from 'react'
import Button from '@/Components/Buttons/base/Button'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {addGroupValidator} from "@/lib/validations/add-group";

interface JoinGroupButtonProps {
}

type FormData = z.infer<typeof addGroupValidator>

const JoinGroupButton: FC<JoinGroupButtonProps> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    })

    const addFriend = async (group_name_input: string) => {
        try {
            // validate user input
            const {group_name} = addGroupValidator.parse({group_name_input})

            await axios.post('/api/groups/add', {
                group_name,
            })

            setShowSuccessState(true)
        } catch (error) {
            console.error(error)
            if (error instanceof z.ZodError) {
                setError('group_name', {message: error.message})
                return
            }

            if (error instanceof AxiosError) {
                setError('group_name', {message: error.response?.data})
                return
            }

            setError('group_name', {message: 'Something went wrong.'})
        }
    }

    const onSubmit = async (data: FormData) => {
        await addFriend(data.group_name)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
            <label
                htmlFor='group_name'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Join a group by name
            </label>

            <div className='mt-2 flex gap-4'>
                <input
                    {...register('group_name')}
                    type='text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='LSI_2023'
                />
                <Button>Join</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.group_name?.message}</p>
            {showSuccessState ? (
                <p className='mt-1 text-sm text-green-600'>Group join request sent!</p>
            ) : null}
        </form>
    )
}

export default JoinGroupButton
