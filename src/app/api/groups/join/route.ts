import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {pusherServer} from '@/lib/pusher'
import {toPusherKey} from '@/lib/utils'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {GroupValidator} from "@/lib/validations/add-group";

export async function POST(req: Request) {
    try {
        const body = await req.json()


        const {group_name} = GroupValidator.parse({group_name: body.group_name})


        console.log(group_name)

        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }

        console.log(group_name)

        let group: string | Group;
        try {
            group = (await fetchRedis(
                'get',
                `group:${group_name}`
            ))
        } catch (error) {
            return new Response('This group does not exist.', {status: 400})
        }


        //parse group object
        group = JSON.parse(group as string) as Group

        console.log(group)
        // if (group.group_owner_id === session.user.id) {
        //     return new Response('You cannot join yourself as a friend', {
        //         status: 400,
        //     })
        // }

        // check if user is already added
        const isAlreadySendJoinRequest = (await fetchRedis(
            'sismember',
            `group:${group_name}:incoming_group_requests`,
            session.user.id
        )) as 0 | 1

        if (isAlreadySendJoinRequest) {
            return new Response('Already send a request to join this group please wait', {status: 400})
        }

        // check if user is already added
        const isAlreadyJoined = (await fetchRedis(
            'sismember',
            `user:${session.user.id}:group-members`,
            group_name
        )) as 0 | 1

        if (isAlreadyJoined) {
            return new Response('Already joined this group', {status: 400})
        }

        // valid request, send friend request

        await pusherServer.trigger(
            toPusherKey(`user:${group_name}:incoming_group_requests`),
            'incoming_group_requests',
            {
                senderId: session.user.id,
                senderEmail: session.user.email,
            }
        )

        await db.sadd(`group:${group_name}:incoming_group_requests`, session.user.id)

        return new Response('OK')
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}
