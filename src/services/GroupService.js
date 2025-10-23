import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Group } from '../models/Group.js';
import { Contribution } from '../models/Contribution.js';
import { Payout } from '../models/Payout.js';
import { ApiError } from '../shared/utils/ApiError.js';

export class GroupService {
  async createGroup(ownerId, payload) {
    const rotation = payload.rotationOrder && payload.rotationOrder.length > 0
      ? payload.rotationOrder
      : [ownerId];

    const group = await Group.create({
      name: payload.name,
      owner: ownerId,
      contributionAmount: payload.contributionAmount,
      frequency: payload.frequency,
      frequencyDays: payload.frequency === 'custom' ? payload.frequencyDays : undefined,
      maxMembers: payload.maxMembers || 12,
      members: [ownerId],
      rotationOrder: rotation,
    });
    return group;
  }

  async joinGroup(groupId, userId) {
    const group = await Group.findById(groupId);
    if (!group || !group.isActive) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    const isMember = group.members.some((m) => m.toString() === userId.toString());
    if (isMember) return group;
    if (group.members.length >= group.maxMembers) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Group is full');
    }
    group.members.push(new mongoose.Types.ObjectId(userId));
    if (!group.rotationOrder.some((m) => m.toString() === userId.toString())) {
      group.rotationOrder.push(new mongoose.Types.ObjectId(userId));
    }
    await group.save();
    return group;
  }

  async listMyGroups(userId) {
    return Group.find({ members: userId }).sort({ createdAt: -1 });
  }

  async getGroup(groupId, requester) {
    const group = await Group.findById(groupId);
    if (!group) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    const isMember = group.members.some((m) => m.toString() === requester.toString());
    return { group, isMember };
  }

  async contribute(groupId, userId) {
    const group = await Group.findById(groupId);
    if (!group || !group.isActive) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    if (!group.members.some((m) => m.toString() === userId.toString())) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not a member of this group');
    }

    const round = group.currentRound;

    const exists = await Contribution.findOne({ group: group.id, user: userId, round });
    if (exists) return exists;

    const contribution = await Contribution.create({
      group: group.id,
      user: userId,
      round,
      amount: group.contributionAmount,
      status: 'paid',
    });

    // After contributing, check if round is complete
    const count = await Contribution.countDocuments({ group: group.id, round, status: 'paid' });
    if (count >= group.members.length) {
      await this._distributePayoutAndAdvance(group);
    }

    return contribution;
  }

  async _distributePayoutAndAdvance(group) {
    const round = group.currentRound;
    const order = group.rotationOrder.map((id) => id.toString());
    const idx = round % order.length;
    const recipient = order[idx];
    const amount = group.contributionAmount * group.members.length;

    const existing = await Payout.findOne({ group: group.id, round });
    if (!existing) {
      await Payout.create({ group: group.id, round, recipient, amount });
    }

    group.currentRound = round + 1;
    await group.save();
  }

  // Admin
  async adminList() {
    return Group.find().sort({ createdAt: -1 });
  }

  async adminGet(groupId) {
    const group = await Group.findById(groupId);
    if (!group) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
    return group;
  }
}
