import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Plane,
  Clock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toISOString().substring(11, 19) + ' UTC';
      const localString = now.toLocaleTimeString('en-US', { hour12: false }) + ' SPH';
      setTime(`${localString} | ${utcString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(7, 11, 20, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px', px: 3 }}>
        {/* Left Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Plane size={24} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.5px',
                background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              SAPHIRE AOCS
            </Typography>
            <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 600 }}>
              Saphire International Airport (`SPH / VASP`)
            </Typography>
          </Box>
        </Box>

        {/* Center Live Operations Clock */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 0.75,
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Clock size={16} color="#38bdf8" />
          <Typography
            variant="body2"
            sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#38bdf8' }}
          >
            {time || '12:00:00 SPH | 06:30:00 UTC'}
          </Typography>
        </Box>

        {/* Right Profile & Role */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {user && (
            <Chip
              icon={<ShieldCheck size={14} color="#34d399" />}
              label={user.roleName.replace(/_/g, ' ')}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700,
                fontSize: '0.72rem',
              }}
            />
          )}

          <Tooltip title="Account Settings">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
                },
              },
            }}
          >
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                {user?.name || 'Staff User'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {user?.departmentName || 'Operations'}
              </Typography>
            </Box>
            <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e', gap: 1.5, py: 1.5, fontWeight: 700 }}>
              <LogOut size={16} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
