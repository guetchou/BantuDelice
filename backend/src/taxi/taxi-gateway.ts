import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { TaxiService } from './taxi.service';
import { TaxiRideStatus } from './entities/taxi-ride.entity';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@UseGuards(WsJwtGuard)
export class TaxiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();
  private connectedDrivers = new Map<string, Socket>();

  constructor(private readonly taxiService: TaxiService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove from connected users/drivers
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
    
    for (const [driverId, socket] of this.connectedDrivers.entries()) {
      if (socket.id === client.id) {
        this.connectedDrivers.delete(driverId);
        break;
      }
    }
  }

  @SubscribeMessage('join_user_room')
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { userId } = data;
    this.connectedUsers.set(userId, client);
    client.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  }

  @SubscribeMessage('join_driver_room')
  handleJoinDriverRoom(
    @MessageBody() data: { driverId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { driverId } = data;
    this.connectedDrivers.set(driverId, client);
    client.join(`driver_${driverId}`);
    console.log(`Driver ${driverId} joined room`);
  }

  @SubscribeMessage('update_driver_location')
  async handleUpdateDriverLocation(
    @MessageBody() data: { 
      driverId: string; 
      latitude: number; 
      longitude: number;
      rideId?: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    const { driverId, latitude, longitude, rideId } = data;
    
    try {
      // Update driver location in database
      await this.taxiService.updateDriverLocation(driverId, latitude, longitude);
      
      // If there's an active ride, notify the passenger
      if (rideId) {
        const ride = await this.taxiService.getRideById(rideId);
        if (ride && ride.userId) {
          this.server.to(`user_${ride.userId}`).emit('driver_location_updated', {
            rideId,
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });
        }
      }
      
      // Broadcast to all connected clients that this driver is available
      this.server.emit('driver_location_updated', {
        driverId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Error updating driver location:', error);
      client.emit('error', { message: 'Failed to update location' });
    }
  }

  @SubscribeMessage('ride_status_update')
  async handleRideStatusUpdate(
    @MessageBody() data: { 
      rideId: string; 
      status: TaxiRideStatus;
      driverId?: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    const { rideId, status, driverId } = data;
    
    try {
      const updatedRide = await this.taxiService.updateRideStatus(rideId, status, driverId);
      
      // Notify the passenger
      if (updatedRide.userId) {
        this.server.to(`user_${updatedRide.userId}`).emit('ride_status_updated', {
          rideId,
          status,
          ride: updatedRide,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Notify the driver if assigned
      if (updatedRide.driverId) {
        this.server.to(`driver_${updatedRide.driverId}`).emit('ride_status_updated', {
          rideId,
          status,
          ride: updatedRide,
          timestamp: new Date().toISOString(),
        });
      }
      
    } catch (error) {
      console.error('Error updating ride status:', error);
      client.emit('error', { message: 'Failed to update ride status' });
    }
  }

  @SubscribeMessage('request_ride')
  async handleRequestRide(
    @MessageBody() data: {
      userId: string;
      pickupAddress: string;
      pickupLatitude: number;
      pickupLongitude: number;
      destinationAddress: string;
      destinationLatitude: number;
      destinationLongitude: number;
      vehicleType: string;
      paymentMethod: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const ride = await this.taxiService.createRide(data);
      
      // Notify the user that ride was created
      client.emit('ride_created', {
        ride,
        timestamp: new Date().toISOString(),
      });
      
      // Broadcast to nearby drivers
      this.server.emit('new_ride_request', {
        ride,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Error creating ride:', error);
      client.emit('error', { message: 'Failed to create ride request' });
    }
  }

  @SubscribeMessage('driver_accept_ride')
  async handleDriverAcceptRide(
    @MessageBody() data: { rideId: string; driverId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { rideId, driverId } = data;
    
    try {
      const updatedRide = await this.taxiService.assignDriverToRide(rideId, driverId);
      
      // Notify the passenger
      this.server.to(`user_${updatedRide.userId}`).emit('driver_assigned', {
        rideId,
        driverId,
        ride: updatedRide,
        timestamp: new Date().toISOString(),
      });
      
      // Notify the driver
      this.server.to(`driver_${driverId}`).emit('ride_accepted', {
        rideId,
        ride: updatedRide,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Error accepting ride:', error);
      client.emit('error', { message: 'Failed to accept ride' });
    }
  }

  @SubscribeMessage('cancel_ride')
  async handleCancelRide(
    @MessageBody() data: { rideId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { rideId, userId } = data;
    
    try {
      const cancelledRide = await this.taxiService.cancelRide(rideId, userId);
      
      // Notify the user
      client.emit('ride_cancelled', {
        rideId,
        ride: cancelledRide,
        timestamp: new Date().toISOString(),
      });
      
      // Notify the driver if assigned
      if (cancelledRide.driverId) {
        this.server.to(`driver_${cancelledRide.driverId}`).emit('ride_cancelled', {
          rideId,
          ride: cancelledRide,
          timestamp: new Date().toISOString(),
        });
      }
      
    } catch (error) {
      console.error('Error cancelling ride:', error);
      client.emit('error', { message: 'Failed to cancel ride' });
    }
  }

  // Method to notify all connected clients about system updates
  notifySystemUpdate(type: string, data: any) {
    this.server.emit('system_update', {
      type,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to notify specific user
  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to notify specific driver
  notifyDriver(driverId: string, event: string, data: any) {
    this.server.to(`driver_${driverId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
} 