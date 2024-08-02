import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from 'src/db/schemas/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response,Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskservices : TaskService){}

    @UseGuards(AuthGuard())
    @Post('create')
    createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<Task> {
      const userId = req.user['_id'];
      console.log(userId)
      return this.taskservices.createTask(createTaskDto,userId);
      
    }

    @UseGuards(AuthGuard())
    @Get('getTasks')
    async getTasks(@Req() req: Request, @Res() res: Response) {
        const userId = req.user['_id'];
        const tasks = await this.taskservices.getTasks(userId);
        res.status(HttpStatus.OK).json(tasks);
    }

    @UseGuards(AuthGuard())
    @Get('getTasksid/:id')
    async getTaskById(@Param('id') taskId: string, @Req() req: Request, @Res() res: Response) {
        const userId = req.user['_id'];
        const task = await this.taskservices.getTaskById(taskId, userId);
        res.status(HttpStatus.OK).json(task);
    }

    @UseGuards(AuthGuard())
    @Patch('updateTask/:id')
    async updateTask(@Param('id') taskId: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request, @Res() res: Response) {
        const userId = req.user['_id'];
        const updatedTask = await this.taskservices.updateTask(taskId, updateTaskDto, userId);
        res.status(HttpStatus.OK).json(updatedTask);
    }
    @UseGuards(AuthGuard())
    @Delete('deleteTask/:id')
    async deleteTask(@Param('id') taskId: string, @Req() req: Request, @Res() res: Response) {
        const userId = req.user['_id'];
        await this.taskservices.deleteTask(taskId, userId);
        res.status(HttpStatus.OK).json({ message: 'Task deleted successfully' });
    }

}
