import { Body, Controller, Get, Post, Query, UseGuards,Optional, DefaultValuePipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import * as moment from 'moment';
import { audit } from 'rxjs';
import { Repository } from 'typeorm';
import { AuditService } from './audit.service';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Crud({
    model: {
      type: Audit,
    },
    query: {
      join: {
        country: {
          eager: true,
        },
        user: {
          eager: true,
        },
        
      },
    },
  })

@Controller('audit')
export class AuditController implements CrudController<Audit> {
    constructor(public service: AuditService,
      @InjectRepository(Audit)
      // private readonly projectRepository: Repository<Audit>,
      public configService: ConfigService,) {}

    get base(): CrudController<Audit> {
        return this;
      }

      @Post()
      create(@Body() auditDto: AuditDto){
        return this.service.create(auditDto);
      }

      @Get(
        'audit/auditinfo/:page/:limit/:userType/:actionStatus/:logDate/:filterText/:institutionId', 
      )
      async getAuditDetails(
        @Query('page') page: number,
        @Query('limit') limit: number,
         @Query('userType') userType: string,
         @Query('actionStatus') actionStatus: string,
        @Query('logDate') logDate: string,
        @Query('filterText') filterText: string,
        @Query('institutionId') institutionId:number
        
      ): Promise<any> {
      
       //let editedOnnew= moment(editedOn, "DD/MM/YYYY");
       console.log("hitttttttt : "+ logDate)
       var timestamp = Date.parse(logDate);
      var dateObject = new Date(timestamp);
      
      console.log('jjjjjjfffff',moment(logDate,'MM-DD-YYYY').format('MM-DD-YYYY'));
      console.log('hhh',logDate)
        return await this.service.getAuditDetails(
          {
            limit: limit,
            page: page,
          },
          filterText,
          userType,
          actionStatus,
          logDate,
          institutionId,
        );

      }


    

}

