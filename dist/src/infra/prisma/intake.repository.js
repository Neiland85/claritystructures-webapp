"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaIntakeRepository = void 0;
function toIntakeRecord(row) {
    return {
        id: row.id,
        createdAt: row.createdAt,
        tone: row.tone,
        route: row.route,
        priority: row.priority,
        name: row.name,
        email: row.email,
        message: row.message,
        phone: row.phone,
        status: row.status,
        spamScore: row.spamScore,
        meta: row.meta,
    };
}
class PrismaIntakeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input) {
        const created = await this.prisma.contactIntake.create({
            data: {
                tone: input.tone,
                route: input.route,
                priority: input.priority,
                name: input.name,
                email: input.email,
                message: input.message,
                phone: input.phone,
                status: input.status,
                spamScore: input.spamScore,
                meta: input.meta ?? undefined,
            },
        });
        return toIntakeRecord(created);
    }
    async findById(id) {
        const record = await this.prisma.contactIntake.findUnique({
            where: { id },
        });
        return record ? toIntakeRecord(record) : null;
    }
    async updateStatus(id, status) {
        const existing = await this.prisma.contactIntake.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing) {
            return null;
        }
        const updated = await this.prisma.contactIntake.update({
            where: { id },
            data: { status },
        });
        return toIntakeRecord(updated);
    }
}
exports.PrismaIntakeRepository = PrismaIntakeRepository;
