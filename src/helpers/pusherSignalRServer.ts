import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";


// todo maintain one connection per key
class PusherServer {
    connection: HubConnection;
    key: string;
    appId: string;
    secret: string;

    constructor({key, appId, secret}: { key: string, appId: string, secret: string }) {
        this.key = key;
        this.appId = appId;
        this.secret = secret;

        this.connection = new HubConnectionBuilder()
            .withUrl(process.env.PUBLIC_HUB_HOST_NAME)
            .configureLogging(LogLevel.Debug)
            .build();


        this.connection.start().then(() => {
            console.log("started")
        });
    }


    async trigger(channel: string, event: string, data: any) {
        await this.connection.invoke("Trigger", channel, event, data);


    }


}

export default PusherServer;