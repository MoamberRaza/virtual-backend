// src/ws/app.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: { origin: '*', credentials: true },
    namespace: '/ws',               // client connects to /ws
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() io!: Server;

    handleConnection(client: Socket) {
        console.log('connected:', client.id);
        // optional: auth check
        // const token = client.handshake.auth?.token || client.handshake.headers['authorization'];
        // if (!isValid(token)) return client.disconnect(true);
    }

    handleDisconnect(client: Socket) {
        console.log('disconnected:', client.id);
    }

    // client: socket.emit('ping', 'hello')
    @SubscribeMessage('ping')
    onPing(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        console.log('ping:', data);
        client.emit('pong', { ok: true, echo: data });
    }
    @SubscribeMessage('internal:initialized')
    onInitiaized(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
        console.log('✅ onInitialized ::', data);
        // client.emit('pong', { ok: true, echo: data });
    }

    // server broadcast example
    broadcast(event: string, payload: any) {
        this.io.emit(event, payload);
    }
}