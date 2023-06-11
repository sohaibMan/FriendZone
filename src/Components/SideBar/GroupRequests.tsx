'use client'

import {pusherClient} from '@/lib/pusher'
import {toPusherKey} from '@/lib/utils'
import axios from 'axios'
import {Check, UserPlus, X} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {FC, useEffect, useState} from 'react'

interface GroupRequestsProps {
    incomingGroupRequests: IncomingGroupRequest[]
    sessionId: string
}

const GroupRequests: FC<GroupRequestsProps> = ({
                                                   incomingGroupRequests,
                                                   sessionId,
                                               }) => {
    const router = useRouter()
    const [groupRequests, setGroupRequests] = useState<IncomingGroupRequest[]>(
        incomingGroupRequests
    )
// todo find a way to listen to comming group request in realtime
    useEffect(() => {
        groupRequests.forEach((group) =>
            pusherClient.subscribe(
                toPusherKey(`group:${group.groupName}:incoming_group_requests`)
            )
        )


        const groupRequestHandler = ({
                                         senderId,
                                         senderEmail,
                                         groupName
                                     }: IncomingGroupRequest) => {
            setGroupRequests((prev) => [...prev, {senderId, senderEmail, groupName}])
        }

        pusherClient.bind('incoming_group_requests', groupRequestHandler)

        return () => {
            groupRequests.forEach((group) =>
                pusherClient.unsubscribe(
                    toPusherKey(`group:${group.groupName}:incoming_group_requests`)
                )
            )
            pusherClient.unbind('incoming_group_requests', groupRequestHandler)
        }
    }, [groupRequests, sessionId])

    const acceptGroup = async (senderId: string) => {
        await axios.post('/api/groups/accept', {id: senderId})

        setGroupRequests((prev) =>
            prev.filter((request) => request.senderId !== senderId)
        )

        router.refresh()
    }

    const denyGroup = async (senderId: string) => {
        await axios.post('/api/groups/deny', {id: senderId})

        setGroupRequests((prev) =>
            prev.filter((request) => request.senderId !== senderId)
        )

        router.refresh()
    }

    return (
        <>
            {groupRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                groupRequests.map((request) => (
                    <div key={request.senderId} className='flex gap-4 items-center'>
                        <UserPlus className='text-black'/>
                        <p>{request.groupName}</p>
                        <p className='font-medium text-lg'>{request.senderEmail} </p>
                        <button
                            onClick={() => acceptGroup(request.senderId)}
                            aria-label='accept group'
                            className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <Check className='font-semibold text-white w-3/4 h-3/4'/>
                        </button>

                        <button
                            onClick={() => denyGroup(request.senderId)}
                            aria-label='deny group'
                            className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <X className='font-semibold text-white w-3/4 h-3/4'/>
                        </button>
                    </div>
                ))
            )
            }
        </>
    )
}

export default GroupRequests
