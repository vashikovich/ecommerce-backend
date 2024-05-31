import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { MetadataResolver } from './metadata.resolver';
import { MetadataService } from './metadata.service';

@Module({
  providers: [MetadataResolver, MetadataService],
  imports: [FirebaseModule],
})
export class MetadataModule {}
