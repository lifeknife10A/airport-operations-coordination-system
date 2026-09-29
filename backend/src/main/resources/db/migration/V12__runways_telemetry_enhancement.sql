-- V12: Enhancements for Runway Surface Telemetry and METAR Vectors (TODO-07)
ALTER TABLE runways 
ADD COLUMN IF NOT EXISTS operational_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE_CAT_III' 
CHECK (operational_status IN ('ACTIVE_CAT_III', 'DEPARTURE_ONLY', 'ARRIVALS_ONLY', 'SWEEP_FOD_INSPECTION', 'CLOSED_MAINTENANCE')),
ADD COLUMN IF NOT EXISTS surface_friction NUMERIC(3,2) NOT NULL DEFAULT 0.84 CHECK (surface_friction >= 0.00 AND surface_friction <= 1.00),
ADD COLUMN IF NOT EXISTS active_ils_frequency VARCHAR(20) DEFAULT '110.30 MHz',
ADD COLUMN IF NOT EXISTS visual_range_meters INT DEFAULT 2000;

-- Calibrate baseline operational vectors for all aerodrome runways
UPDATE runways SET operational_status = 'ACTIVE_CAT_III', surface_friction = 0.88, active_ils_frequency = '109.50 MHz', visual_range_meters = 2400 WHERE runway_id = 1;
UPDATE runways SET operational_status = 'DEPARTURE_ONLY', surface_friction = 0.82, active_ils_frequency = '110.10 MHz', visual_range_meters = 2100 WHERE runway_id = 2;
UPDATE runways SET operational_status = 'ARRIVALS_ONLY', surface_friction = 0.85, active_ils_frequency = '108.90 MHz', visual_range_meters = 1950 WHERE runway_id = 3;
UPDATE runways SET operational_status = 'SWEEP_FOD_INSPECTION', surface_friction = 0.79, active_ils_frequency = '111.30 MHz', visual_range_meters = 1800 WHERE runway_id = 4;
