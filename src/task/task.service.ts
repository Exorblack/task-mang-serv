import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/db/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

    async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const newTask = new this.taskModel({...createTaskDto, user:userId });
        return newTask.save();

      }

    async getTasks(userId: string): Promise<Task[]> {
        return this.taskModel.find({ user: userId }).exec();
    }

    async getTaskById(taskId: string, userId: string): Promise<Task> {
      const task = await this.taskModel.findOne({ _id: taskId, user: userId }).exec();
      if (!task) {
          throw new NotFoundException(`Task not found`);
      }
      return task;
  }

    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
      const updatedTask = await this.taskModel.findOneAndUpdate(
          { _id: taskId, user: userId },
          updateTaskDto,
          { new: true }
      ).exec();
      if (!updatedTask) {
          throw new NotFoundException(`Task can not found`);
      }
      return updatedTask;
  }

    async deleteTask(taskId: string, userId: string): Promise<boolean> {
      const result = await this.taskModel.findOneAndDelete({ _id: taskId, user: userId }).exec();
      if (!result) {
          throw new NotFoundException(`Task can not found`);
      }
      return true;
  }
  
}
