const Ticket = require('../models/Ticket');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

class TicketService {
    async createTicket(ticketData, userId) {
        const ticket = await Ticket.create({
            ...ticketData,
            creator: userId
        });

        await ticket.populate('creator', 'firstName lastName email');
        if (ticket.group) {
            await ticket.populate('group', 'name');
        }

        return ticket;
    }

    async getUserTickets(userId) {
        const tickets = await Ticket.find({ creator: userId })
            .populate('group', 'name')
            .populate('assignedTo', 'firstName lastName')
            .sort('-createdAt');

        return tickets;
    }

    async getAllTickets(filters = {}) {
        const query = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.priority) {
            query.priority = filters.priority;
        }

        const tickets = await Ticket.find(query)
            .populate('creator', 'firstName lastName email')
            .populate('group', 'name')
            .populate('assignedTo', 'firstName lastName')
            .sort('-createdAt');

        return tickets;
    }

    async updateTicket(ticketId, updateData, userId, isAdmin = false) {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError('Ticket not found');
        }

        // Only admin or creator can update
        if (!isAdmin && ticket.creator.toString() !== userId.toString()) {
            throw new AuthorizationError('Not authorized to update this ticket');
        }

        // Admin-only fields
        if (!isAdmin) {
            delete updateData.assignedTo;
            delete updateData.status;
        }

        // Update status dates
        if (updateData.status === 'resolved' && ticket.status !== 'resolved') {
            updateData.resolvedAt = new Date();
        }

        if (updateData.status === 'closed' && ticket.status !== 'closed') {
            updateData.closedAt = new Date();
        }

        Object.assign(ticket, updateData);
        await ticket.save();

        return ticket;
    }

    async addResponse(ticketId, userId, message) {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError('Ticket not found');
        }

        ticket.responses.push({
            user: userId,
            message,
            createdAt: new Date()
        });

        await ticket.save();
        await ticket.populate('responses.user', 'firstName lastName');

        return ticket;
    }
}

module.exports = new TicketService();
