'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RiCarLine, 
  RiEyeLine, 
  RiTimeLine, 
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiCameraLine,
  RiParkingBoxLine,
  RiShieldCheckLine
} from 'react-icons/ri';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

// Define types for ALPR data
interface ParkingEntry {
  id: number;
  license_plate: string;
  entry_time: string;
  exit_time?: string;
  status: 'PARKED' | 'EXITED' | 'VIOLATION';
  confidence: number;
  camera_id: string;
  vehicle_type: string;
  image_url?: string;
}

interface DashboardStats {
  totalVehicles: number;
  currentlyParked: number;
  todayEntries: number;
  violations: number;
  averageStayTime: string;
  occupancyRate: number;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [entries, setEntries] = useState<ParkingEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    currentlyParked: 0,
    todayEntries: 0,
    violations: 0,
    averageStayTime: '0h 0m',
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const successMessage = searchParams.get('success');
    if (successMessage) {
      toast({
        title: `Welcome back ${user?.email}`,
        description: decodeURIComponent(successMessage),
      });
    }
  }, [searchParams, toast, user]);

  // Simulate fetching ALPR data (replace with actual API call)
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockEntries: ParkingEntry[] = [
          {
            id: 1,
            license_plate: 'B 1234 ABC',
            entry_time: new Date().toISOString(),
            status: 'PARKED',
            confidence: 0.95,
            camera_id: 'CAM-001',
            vehicle_type: 'Car'
          },
          {
            id: 2,
            license_plate: 'B 5678 DEF',
            entry_time: new Date(Date.now() - 3600000).toISOString(),
            exit_time: new Date().toISOString(),
            status: 'EXITED',
            confidence: 0.89,
            camera_id: 'CAM-002',
            vehicle_type: 'Motorcycle'
          },
          {
            id: 3,
            license_plate: 'B 9012 GHI',
            entry_time: new Date(Date.now() - 7200000).toISOString(),
            status: 'VIOLATION',
            confidence: 0.72,
            camera_id: 'CAM-001',
            vehicle_type: 'Car'
          }
        ];

        const mockStats: DashboardStats = {
          totalVehicles: 156,
          currentlyParked: 23,
          todayEntries: 89,
          violations: 3,
          averageStayTime: '2h 15m',
          occupancyRate: 76
        };

        setEntries(mockEntries);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching parking data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load parking data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [toast]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PARKED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'EXITED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'VIOLATION':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PARKED':
        return <RiParkingBoxLine className="h-4 w-4" />;
      case 'EXITED':
        return <RiCheckLine className="h-4 w-4" />;
      case 'VIOLATION':
        return <RiAlertLine className="h-4 w-4" />;
      default:
        return <RiCarLine className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ALPR Parking Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and management of parking activities
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/monitoring">
            <Button variant="outline">
              <RiEyeLine className="mr-2 h-4 w-4" />
              Live Monitoring
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Vehicles Today',
            value: stats.todayEntries.toString(),
            change: '+12% from yesterday',
            icon: RiCarLine,
            color: 'text-blue-600'
          },
          {
            title: 'Currently Parked',
            value: stats.currentlyParked.toString(),
            change: `${stats.occupancyRate}% occupancy`,
            icon: RiParkingBoxLine,
            color: 'text-green-600'
          },
          {
            title: 'Avg. Stay Time',
            value: stats.averageStayTime,
            change: 'Updated real-time',
            icon: RiTimeLine,
            color: 'text-purple-600'
          },
          {
            title: 'Violations',
            value: stats.violations.toString(),
            change: 'Requires attention',
            icon: RiAlertLine,
            color: 'text-red-600'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Occupancy Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiShieldCheckLine className="h-5 w-5 text-green-600" />
              Parking Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.currentlyParked} of {Math.round(stats.currentlyParked / (stats.occupancyRate / 100))} spaces occupied
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold tracking-tight mb-4">
          {loading ? 'Loading Recent Entries...' : 'Recent ALPR Entries'}
        </h2>
        <div className="grid gap-4">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={`loading-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
          ) : entries.length > 0 ? (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono">
                        {entry.license_plate}
                      </CardTitle>
                      <Badge className={getStatusColor(entry.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(entry.status)}
                          {entry.status}
                        </span>
                      </Badge>
                    </div>
                    <CardDescription>
                      {formatDate(entry.entry_time)} at {formatTime(entry.entry_time)}
                      {entry.exit_time && ` - Exited at ${formatTime(entry.exit_time)}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vehicle Type</p>
                        <p className="font-medium">{entry.vehicle_type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Camera ID</p>
                        <p className="font-medium">{entry.camera_id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-medium">{(entry.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <RiCarLine className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No entries today</h3>
                    <p className="text-muted-foreground mb-4">
                      ALPR system is ready to detect and log vehicle entries.
                    </p>
                    <Link href="/dashboard/monitoring">
                      <Button>
                        <RiEyeLine className="mr-2 h-4 w-4" />
                        Start Monitoring
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}