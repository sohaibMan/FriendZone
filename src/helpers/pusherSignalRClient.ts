import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";


class PusherClient {
    private static instance: PusherClient;
    connection: HubConnection;
    appKey: string;

    private constructor(appKey: string) {
        this.appKey = appKey;
        this.connection = new HubConnectionBuilder()
            .withUrl(process.env.NEXT_PUBLIC_HUB_HOST_NAME)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Debug)
            .build();

        // this.connection.on("ChannelSubscribed", (channel_name: string) => {
        this.start().then(() => {
            console.log("started")
        });
        //
        this.connection.onclose(async () => {
            console.log("connection closed");
        })
        this.connection.onreconnected(async () => {
            console.log("connection reconnected");
        })
        this.connection.onreconnecting(async () => {
            console.log("connection is reconnecting");
        })
        this.connection.on("messagereceived", (channel_name: string) => {
            console.log("message received", channel_name);
        })
    }

    public static getInstance(appKey: string) {
        if (!PusherClient.instance) {
            PusherClient.instance = new PusherClient(appKey);
        }
        return PusherClient.instance;
    }

    async subscribe(channel_name: string) {
        console.log("state", this.connection.state)
        if (this.connection.state == HubConnectionState.Disconnected) {
            await this.start();
        }

        await this.connection.invoke("SubscribeToChannel", channel_name);

    }

    async unsubscribe(channel_name: string) {
        console.log("state", this.connection.state)

        if (this.connection.state == HubConnectionState.Disconnected) {
            await this.start();
        }

        await this.connection.invoke("SubscribeToChannel", channel_name);

    }

    async bind(event_name: string, callback: (data: any) => void) {
        console.log("state", this.connection.state)
        if (this.connection.state == HubConnectionState.Disconnected) {
            await this.start();
        }
        this.connection.on(event_name, callback);
    }

    async unbind(event_name: string, callback: (data: any) => void) {
        console.log("state", this.connection.state)
        if (this.connection.state == HubConnectionState.Disconnected) {
            await this.start();
        }
        this.connection.off(event_name, callback);
    }


    private async start() {


        if (this.connection.state == HubConnectionState.Disconnected) {

            await this.connection.start();
        }

    };
}


export default PusherClient;
