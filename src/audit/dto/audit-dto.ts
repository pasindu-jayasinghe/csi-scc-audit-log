import { RecordStatus } from 'src/shared/entities/base.tracking.entity';

export class AuditDto {
  logDate : Date;
  logTime: string;
  userName: string;
  description: string;
  action: string;
  userType: string;
  userId: string;
  infor: any;
  method: string;
}