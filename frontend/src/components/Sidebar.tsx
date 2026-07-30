import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  LayoutDashboard,
  PlaneTakeoff,
  GitCommit,
  Grid,
  CheckSquare,
  Sparkles,
  Fuel,
  Wrench,
  Utensils,
  UserCheck,
  Shield,
  Users,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

export const navItems = [
  { label: 'Operations Command', path: '/', icon: LayoutDashboard, category: 'Core' },
  { label: 'Live FIDS Schedule', path: '/flights', icon: PlaneTakeoff, category: 'Core' },
  { label: 'Turnaround Detail', path: '/flights/1', icon: GitCommit, category: 'Core' },
  { label: 'Gate & Stand Map', path: '/gates', icon: Grid, category: 'Core' },
  { label: 'Turnaround Task Grid', path: '/tasks', icon: CheckSquare, category: 'Core' },
  
  { label: 'Cabin Cleaning', path: '/cleaning', icon: Sparkles, category: 'Ramp Services' },
  { label: 'Refueling Variance', path: '/refueling', icon: Fuel, category: 'Ramp Services' },
  { label: 'Line Maintenance', path: '/maintenance', icon: Wrench, category: 'Ramp Services' },
  { label: 'Catering Replenish', path: '/catering', icon: Utensils, category: 'Ramp Services' },
  
  { label: 'Passenger Boarding', path: '/boarding', icon: UserCheck, category: 'Terminal Services' },
  { label: 'Security Sweep', path: '/security', icon: Shield, category: 'Terminal Services' },
  { label: 'Passenger Manifest', path: '/manifest', icon: Users, category: 'Terminal Services' },
  
  { label: 'Delay Analytics', path: '/reports', icon: BarChart3, category: 'Analytics & Audit' },
  { label: 'Security Audit Logs', path: '/audit', icon: FileText, category: 'Analytics & Audit' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#070b14',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          pt: '72px',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', px: 1.5, pb: 4 }}>
        {categories.map((cat, catIdx) => (
          <Box key={cat} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 0.5,
                display: 'block',
                color: '#64748b',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.68rem',
              }}
            >
              {cat}
            </Typography>
            <List disablePadding>
              {navItems
                .filter((item) => item.category === cat)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);

                  return (
                    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        sx={{
                          borderRadius: '10px',
                          py: 1,
                          px: 2,
                          backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                          border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                          color: isActive ? '#38bdf8' : '#94a3b8',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#ffffff',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#38bdf8' : '#64748b' }}>
                          <Icon size={18} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: '0.85rem',
                                fontWeight: isActive ? 700 : 500,
                              },
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
            {catIdx < categories.length - 1 && (
              <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
            )}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};
