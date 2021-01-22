/* eslint-disable camelcase */
import { getRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        return findAppointment;
    }

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
