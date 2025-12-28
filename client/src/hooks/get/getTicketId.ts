import API from '../../services/api';

export const getTicketId = async (ticketId: string) => {
    try {
        const res = await API.get(`/transaction/user/ticket/${ticketId}`);
        return res.data;
    } catch (error) {
        console.error('Failed to fetch ticket:', error);
        throw error;
    }
}