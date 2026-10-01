// Single source of truth for which dashboard each backend role may open. Anything not listed here
// has no dashboard at all (previously unknown roles silently fell through to the admin one).
export const ROLE_TO_DASHBOARD: Record<string, string> = {
  SYSTEM_ADMINISTRATOR: 'system-admin',
  AIRPORT_OPERATIONS_MANAGER: 'aocc',
  GROUND_HANDLING_SUPERVISOR: 'ground-ops',
  RAMP_AGENT: 'ground-ops',
  AIRLINE_BILLING_CLERK: 'department',
  GATE_AGENT: 'airside-ops',
  BAGGAGE_HANDLER: 'logistics',
  SECURITY_OFFICER: 'passenger-security',
  IMMIGRATION_OFFICER: 'passenger-security',
  CHECKIN_AGENT: 'check-in',
};

export const dashboardSlugFor = (roleName: string | undefined | null): string | null =>
  (roleName && ROLE_TO_DASHBOARD[roleName]) || null;

export const dashboardPathFor = (roleName: string | undefined | null): string | null => {
  const slug = dashboardSlugFor(roleName);
  return slug ? `/dashboard/${slug}` : null;
};
