import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { timeStamp } from 'console';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Injectable()
export class AuditService extends TypeOrmCrudService<Audit> {
  contextUser: any;
  constructor(@InjectRepository(Audit) repo, @Inject(REQUEST) private request) {
    super(repo);
  }

  async create(auditDto: AuditDto) {
    let  date  = new Date()
    // const year = date.getFullYear();
    // const month = ('0' + (date.getMonth() + 1)).slice(-2);
    // const day = ('0' + date.getDate()).slice(-2);
    // let y = `${year}-${month}-${day}`;

    auditDto.logDate = date
    var newaudit = await this.repo.save(auditDto);
    return newaudit
  }

  
  async getAuditDetails(
      options: IPaginationOptions,
      filterText: string,
      userType : string,
      actionStatus: string,
      logDate: string,
      institutionId:number
    ): Promise<Pagination<Audit>> {
      let filter: string = '';  
      if (filterText != null && filterText != undefined && filterText != '') {
        filter =
          '(dr.userName LIKE :filterText OR dr.action LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )';
      }
      if (logDate != null && logDate != undefined && logDate != '') {
        let fromTo = logDate.split("to")
        let from = fromTo[0] ? fromTo[0]: null;
        let to = fromTo[1] ? fromTo[1]: null;

        if(from && from.trim() !== ''){
          if(!to){
            to = new Date().toDateString();
          }
          if(filter){
            filter = `${filter} and  (logDate BETWEEN '${from.trim()}' AND '${to.trim()}' )`;
          }else{
            filter = `( logDate BETWEEN '${from.trim()}' AND '${to.trim()}' )`;
          }
        }
      }
  
  
      if (userType != null && userType != undefined && userType != '') {
  
        if (filter) {
          filter = `${filter}  and dr.userType LIKE :userType`;
        } else {
          filter = `dr.userType LIKE :userType`;
        }
      }

      let data = this.repo
      .createQueryBuilder('dr')  
      .where(filter, {
        filterText: `%${filterText}%`,
        userType: userType,
      })
      .orderBy('dr.logDate', 'DESC');

      // console.log(data.getQuery());
      let result = await paginate(data, options);

      if (result) {
        return result;
      }      
    }

}
  

