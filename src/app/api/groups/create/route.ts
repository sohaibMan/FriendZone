import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {addGroupValidator} from "@/lib/validations/add-group";

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {group_name} = addGroupValidator.parse({group_name: body.group_name})


        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }


        try {
            await fetchRedis(
                'get',
                `group:${group_name}`
            )
        } catch (error) {
            return new Response('Group already exists with this name.', {status: 400})
        }


        // create group
        await db.sadd(`group:${group_name}`, session.user.id)

        return new Response('OK')
    } catch (error) {

        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }


        return new Response('Invalid request', {status: 400})
    }
}
