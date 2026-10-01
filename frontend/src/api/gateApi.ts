import axiosClient from './axiosClient';
import { Gate, GateAssignmentPayload } from '../types';

// Backend GateResponseDTO -> frontend Gate (see the matching note in flightApi.ts). The backend
// reports gateNumber/terminal and the flights currently on the gate; occupancy and the assigned
// flight are derived from `activeFlights` rather than read from fields the API doesn't send.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeGate = (d: any): Gate => {
  const active = Array.isArray(d.activeFlights) && d.activeFlights.length > 0 ? d.activeFlights[0] : undefined;
  const stands = Array.isArray(d.stands) ? d.stands : [];
  return {
    gateId: d.gateId,
    gateCode: d.gateNumber,
    terminalName: d.terminal ?? '',
    concourse: d.concourse ?? undefined,
    maxWingspanMeters: d.maxWingspanMeters ?? undefined,
    hasJetbridge: stands.some((s: { hasJetbridge?: boolean }) => !!s.hasJetbridge),
    status: active ? 'OCCUPIED' : 'AVAILABLE',
    assignedFlightId: active?.flightId,
    assignedFlightNumber: active?.flightNumber,
    stands: stands.map((s: { standId: number; standNumber: string; isRemote?: boolean }) => ({
      standId: s.standId,
      standCode: s.standNumber,
      concourse: d.concourse ?? undefined,
      isRemote: !!s.isRemote,
      maxAircraftSize: '',
      status: 'AVAILABLE' as const,
    })),
  };
};

export const gateApi = {
  getAllGates: async (): Promise<Gate[]> => {
    const response = await axiosClient.get('/gates');
    return response.data.map(normalizeGate);
  },

  assignGateToFlight: async (payload: GateAssignmentPayload): Promise<void> => {
    await axiosClient.put('/gates/assign', payload);
  },
};
