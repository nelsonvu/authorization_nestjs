import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Log from 'src/entities/log.entity';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/createLog.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }
}
