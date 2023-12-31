import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  async create(task: Task): Promise<Task> {
    // completed default is false when createing a new task
    task.completed = false;
    return this.tasksRepository.save(task);
  }

  async update(id: number, task: Task): Promise<Task> {
    const taskExists: Task = await this.tasksRepository.findOne({
      where: { id: task.id },
    });

    if (!taskExists) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = { ...taskExists, ...task };

    return this.tasksRepository.save(updatedTask);
  }

  async delete(id: number): Promise<Task> {
    const taskExists: Task = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!taskExists) {
      throw new Error(`Task with id ${id} not found`);
    }

    return this.tasksRepository.remove(taskExists);
  }
}
