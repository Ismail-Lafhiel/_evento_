import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location, LocationSchema } from '../schemas/location.schema';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { UsersModule } from '../users/users.module';
import { OrganizerGuard } from 'src/guards/organizer.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    UsersModule,
  ],
  controllers: [LocationController],
  providers: [LocationService, OrganizerGuard],
  exports: [LocationService, OrganizerGuard],
})
export class LocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(LocationController);
  }
}
