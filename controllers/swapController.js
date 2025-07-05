const { z } = require('zod');
const Student = require('../models/Student');

// In-memory swap requests (for demo; use DB in production)
const swapRequests = [];

exports.requestSwap = async (req, res) => {
  try {
    const { targetStudentId } = z.object({
      targetStudentId: z.string()
    }).parse(req.body);
    const requesterId = req.user.id;
    if (requesterId === targetStudentId) return res.status(400).json({ message: 'Cannot swap with yourself' });
    const target = await Student.findById(targetStudentId);
    if (!target) return res.status(404).json({ message: 'Target student not found' });
    swapRequests.push({ requesterId, targetStudentId, status: 'pending' });
    res.json({ message: 'Swap request sent' });
  } catch (err) {
    res.status(400).json({ message: err.errors ? err.errors : err.message });
  }
};

exports.acceptSwap = async (req, res) => {
  try {
    const { requesterId } = z.object({
      requesterId: z.string()
    }).parse(req.body);
    const targetStudentId = req.user.id;
    const swap = swapRequests.find(r => r.requesterId === requesterId && r.targetStudentId === targetStudentId && r.status === 'pending');
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    // Swap room and bedType
    const requester = await Student.findById(requesterId);
    const target = await Student.findById(targetStudentId);
    if (!requester || !target) return res.status(404).json({ message: 'Student not found' });
    const temp = { hostel: requester.hostel, bedType: requester.bedType, roomNumber: requester.roomNumber };
    requester.hostel = target.hostel;
    requester.bedType = target.bedType;
    requester.roomNumber = target.roomNumber;
    target.hostel = temp.hostel;
    target.bedType = temp.bedType;
    target.roomNumber = temp.roomNumber;
    await requester.save();
    await target.save();
    swap.status = 'accepted';
    res.json({ message: 'Swap successful' });
  } catch (err) {
    res.status(400).json({ message: err.errors ? err.errors : err.message });
  }
};

exports.listSwaps = (req, res) => {
  const userId = req.user.id;
  const requests = swapRequests.filter(r => r.requesterId === userId || r.targetStudentId === userId);
  res.json({ swaps: requests });
}; 