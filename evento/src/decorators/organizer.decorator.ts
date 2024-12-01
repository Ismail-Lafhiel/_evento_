import { SetMetadata } from '@nestjs/common';

export const ORGANIZER_KEY = 'organizer';
export const Organizer = () => SetMetadata(ORGANIZER_KEY, true);
