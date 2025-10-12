const ticketService = require('../services/ticketService');
const ApiResponse = require('../utils/response');

class TicketController {
    async createTicket(req, res, next) {
        try {
            const ticket = await ticketService.createTicket(req.body, req.user._id);

            ApiResponse.created(res, { ticket }, 'Ticket created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getUserTickets(req, res, next) {
        try {
            const tickets = await ticketService.getUserTickets(req.user._id);

            ApiResponse.success(res, { tickets }, 'Tickets retrieved');
        } catch (error) {
            next(error);
        }
    }

    async updateTicket(req, res, next) {
        try {
            const isAdmin = req.user.role === 'Admin';
            const ticket = await ticketService.updateTicket(
                req.params.id,
                req.body,
                req.user._id,
                isAdmin
            );

            ApiResponse.success(res, { ticket }, 'Ticket updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async addResponse(req, res, next) {
        try {
            const { message } = req.body;
            const ticket = await ticketService.addResponse(
                req.params.id,
                req.user._id,
                message
            );

            ApiResponse.success(res, { ticket }, 'Response added');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TicketController();
