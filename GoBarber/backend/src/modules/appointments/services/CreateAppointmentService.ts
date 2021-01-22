/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/error/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    constructor(appointmentsRepository: IAppointmentsRepository) {}

    public async execute({
        provider_id,
        date,
    }: RequestDTO): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentRepository.findByDate(
            {
                date: appointmentDate,
            },
        );

        if (findAppointmentInSameDate) {
            throw new AppError('this appointment is already booked');
        }

        const appointment = await appointmentRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
