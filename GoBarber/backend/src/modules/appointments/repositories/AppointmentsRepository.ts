import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface RequestDTO {
    date: Date;
}

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate({ date }: RequestDTO): Promise<Appointment | null> {
        const findAppointment = await this.findOne({ where: { date } });

        return findAppointment || null;
    }
}

export default AppointmentsRepository;
