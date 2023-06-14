// import PusherServer from 'pusher'
// import PusherClient from "pusher-js"

import PusherServer from "@/helpers/pusherSignalRServer";
import PusherClient from "@/helpers/pusherSignalRClient";

const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
})


// export const pusherServer = new PusherServer({
//     appId: process.env.PUSHER_APP_ID!,
//     key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//     secret: process.env.PUSHER_APP_SECRET!,
//     cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//     useTLS: true,
// })

const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!
)
// export const pusherClient = new PusherClient(
//   process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//   {
//     cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   }
// )
export {pusherServer, pusherClient}