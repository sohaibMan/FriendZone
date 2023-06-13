import ChatInput from '@/Components/Input/ChatInput'
import Messages from '@/Components/Layout/Messages'
import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {messageArrayValidator} from '@/lib/validations/message'
import {getServerSession} from 'next-auth'
import Image from 'next/image'
import {notFound} from 'next/navigation'


export const metadata = {
    title: 'FriendZone | Dashboard',
    description: "todo",
}


interface PageProps {
    params: {
        groupName: string
    }
}

async function getChatMessages(groupName: string) {
    try {
        const results: string[] = await fetchRedis(
            'zrange',
            `chat:${groupName}:messages`,
            0,
            -1
        )

        const dbMessages = results.map((message) => JSON.parse(message) as Message)

        const reversedDbMessages = dbMessages.reverse()

        return messageArrayValidator.parse(reversedDbMessages)
    } catch (error) {
        notFound()
    }
}

const page = async ({params}: PageProps) => {
    const {groupName} = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()


    const {user} = session

    const userGroupNames = await fetchRedis('smembers', `user:${user.id}:groups`)

    // check if the user has the right to chat in this group
    if (!groupName || !userGroupNames.includes(groupName)) {
        notFound()
    }


    const groupMembersRaw = (await fetchRedis(
        'smembers',
        `group:${groupName}:group-members`
    )) as string[]
    const chatPartners = groupMembersRaw.map(groupMemberRaw => JSON.parse(groupMemberRaw)) as User[]
    const initialMessages = await getChatMessages(groupName)

    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
            <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
                <div className='relative flex items-center space-x-4'>
                    <div className='relative'>
                        <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                src={chatPartners[0].image}
                                alt={`${chatPartners[0].name} profile picture`}
                                className='rounded-full'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col leading-tight'>
                        <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartners[0].name}
              </span>
                        </div>

                        <span className='text-sm text-gray-600'>{chatPartners[0].email}</span>
                    </div>
                </div>
            </div>

            <Messages
                chatId={groupName}
                chatPartner={chatPartners[0]}
                sessionImg={session.user.image}
                sessionId={session.user.id}
                initialMessages={initialMessages}
            />
            <ChatInput chatId={groupName} chatPartner={chatPartners[0]}/>
        </div>
    )
}

export default page
