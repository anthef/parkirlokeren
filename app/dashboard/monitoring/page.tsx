'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  // ... your icons ...
  RiCameraLine, 
  RiRadioButtonLine,
  RiSignalWifiLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
  RiPlayLine,
  RiPauseLine,
  RiRefreshLine,
  RiCarLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiRecordCircleLine,
  RiLoader4Line // Add a loader icon
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Import Next.js Image for placeholders if needed
import { useAuth } from '@/hooks/useAuth';

// Define types for live monitoring
interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  resolution: string;
  fps: number;
  lastPing: string;
  isRecording: boolean;
}

interface LiveDetection {
  id: number;
  camera_id: string;
  license_plate: string;
  confidence: number;
  timestamp: string;
  vehicle_type: string;
  status: 'DETECTED' | 'VALIDATED' | 'REJECTED';
  image_url?: string;
}

interface SystemMetrics {
  totalCameras: number;
  activeCameras: number;
  totalDetections: number;
  processingLatency: number;
  accuracy: number;
  uptime: string;
}

const LiveCameraFeed = ({ camera }: { camera: CameraFeed }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use the API proxy route as the source
  const feedUrl = `/api/camera-feed`;

  if (hasError) {
    return (
      <div className="aspect-video w-full bg-black flex flex-col items-center justify-center text-white rounded-lg">
        <RiSignalWifiLine className="h-10 w-10 mb-2 text-red-500" />
        <p className="font-semibold">Feed Error</p>
        <p className="text-sm text-muted-foreground">Could not load stream.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black flex items-center justify-center rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <RiLoader4Line className="h-10 w-10 animate-spin text-white" />
          <p className="text-white mt-2">Connecting to {camera.name}...</p>
        </div>
      )}
      
      <img
        src={feedUrl}
        alt={`Live feed from ${camera.name}`}
        className="w-full h-full object-cover z-0"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default function MonitoringPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cameras, setCameras] = useState<CameraFeed[]>([]);
  const [liveDetections, setLiveDetections] = useState<LiveDetection[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalCameras: 0,
    activeCameras: 0,
    totalDetections: 0,
    processingLatency: 0,
    accuracy: 0,
    uptime: '0h 0m'
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = () => {
      const mockCameras: CameraFeed[] = [
        {
          id: 'CAM-001',
          name: 'Main Entrance',
          location: 'Gate A',
          status: 'ONLINE',
          resolution: '1920x1080',
          fps: 30,
          lastPing: new Date().toISOString(),
          isRecording: true
        },
        {
          id: 'CAM-002',
          name: 'Exit Gate',
          location: 'Gate B',
          status: 'OFFLINE',
          resolution: '1920x1080',
          fps: 30,
          lastPing: new Date().toISOString(),
          isRecording: false
        },
        {
          id: 'CAM-003',
          name: 'Secondary Entrance',
          location: 'Gate C',
          status: 'OFFLINE',
          resolution: '1280x720',
          fps: 24,
          lastPing: new Date(Date.now() - 300000).toISOString(),
          isRecording: false
        },
        {
          id: 'CAM-004',
          name: 'Parking Area 1',
          location: 'Zone A',
          status: 'OFFLINE',
          resolution: '1920x1080',
          fps: 25,
          lastPing: new Date().toISOString(),
          isRecording: false
        }
      ];

      const mockMetrics: SystemMetrics = {
        totalCameras: 4,
        activeCameras: 1,
        totalDetections: 1247,
        processingLatency: 120,
        accuracy: 94.7,
        uptime: '15h 42m'
      };

      setCameras(mockCameras);
      setMetrics(mockMetrics);
      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const mockDetection: LiveDetection = {
        id: Date.now(),
        camera_id: ['CAM-001', 'CAM-002', 'CAM-004'][Math.floor(Math.random() * 3)],
        license_plate: generateRandomPlate(),
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
        vehicle_type: ['Car', 'Motorcycle', 'Truck'][Math.floor(Math.random() * 3)],
        status: 'DETECTED'
      };

      setLiveDetections(prev => [mockDetection, ...prev.slice(0, 9)]);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalDetections: prev.totalDetections + 1
      }));

    }, Math.random() * 15000 + 120000); 

    return () => clearInterval(interval);
  }, [isMonitoring, toast]);

  const generateRandomPlate = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    return `B ${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]} ${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}`;
  };

  const getCameraName = (cameraId: string) => {
    const camera = cameras.find(cam => cam.id === cameraId);
    return camera ? camera.name : cameraId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'ERROR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'DETECTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'VALIDATED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <RiCheckLine className="h-4 w-4" />;
      case 'OFFLINE':
        return <RiCloseLine className="h-4 w-4" />;
      case 'ERROR':
        return <RiAlertLine className="h-4 w-4" />;
      default:
        return <RiRadioButtonLine className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? 'Monitoring Paused' : 'Monitoring Started',
      description: isMonitoring ? 'Real-time detection paused' : 'Real-time detection resumed',
    });
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RiEyeLine className="h-8 w-8 text-blue-600" />
            Live Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time ALPR system monitoring and detection logs
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isMonitoring ? "default" : "outline"}
            onClick={toggleMonitoring}
          >
            {isMonitoring ? (
              <>
                <RiPauseLine className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <RiPlayLine className="mr-2 h-4 w-4" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline">
            <RiRefreshLine className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiCameraLine className="h-6 w-6 text-blue-600" />
              Live Camera Feeds
            </CardTitle>
            <CardDescription>Real-time video streams from active cameras.</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {cameras
                  .filter((cam) => cam.status === 'ONLINE')
                  .map((camera) => (
                    <div key={camera.id}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{camera.name}</h4>
                        <p className="text-sm text-muted-foreground">{camera.location}</p>
                      </div>
                      <LiveCameraFeed camera={camera} />
                    </div>
                  ))}
                {cameras.filter((cam) => cam.status === 'ONLINE').length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-4">
                    No cameras are currently online.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                <RiEyeOffLine className="mx-auto h-8 w-8 mb-2" />
                Please log in to view live camera feeds.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Active Cameras',
            value: `${metrics.activeCameras}/${metrics.totalCameras}`,
            change: 'System Status',
            icon: RiCameraLine,
            color: 'text-green-600'
          },
          {
            title: 'Total Detections',
            value: metrics.totalDetections.toLocaleString(),
            change: 'Since last restart',
            icon: RiShieldCheckLine,
            color: 'text-blue-600'
          },
          {
            title: 'Processing Latency',
            value: `${metrics.processingLatency}ms`,
            change: 'Average response time',
            icon: RiTimeLine,
            color: 'text-purple-600'
          },
          {
            title: 'Accuracy Rate',
            value: `${metrics.accuracy}%`,
            change: `Uptime: ${metrics.uptime}`,
            icon: RiSignalWifiLine,
            color: 'text-orange-600'
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Camera Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiCameraLine className="h-5 w-5" />
                Camera Status
              </CardTitle>
              <CardDescription>
                Real-time status of all ALPR cameras
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cameras.map((camera, index) => (
                <motion.div
                  key={camera.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{camera.name}</h4>
                      <Badge className={getStatusColor(camera.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(camera.status)}
                          {camera.status}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {camera.location} • {camera.resolution} @ {camera.fps}fps
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last ping: {formatTime(camera.lastPing)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {camera.isRecording && (
                      <RiRecordCircleLine className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                    <Button variant="outline" size="sm">
                      {camera.status === 'ONLINE' ? (
                        <RiEyeLine className="h-4 w-4" />
                      ) : (
                        <RiEyeOffLine className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Detections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiCarLine className="h-5 w-5" />
                Live Detections
                {isMonitoring && (
                  <div className="flex items-center gap-1 text-green-600">
                    <RiRadioButtonLine className="h-3 w-3 animate-pulse" />
                    <span className="text-xs">LIVE</span>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Real-time license plate detections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {liveDetections.length > 0 ? (
                    liveDetections.map((detection) => (
                      <motion.div
                        key={detection.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-mono font-bold text-lg">
                              {detection.license_plate}
                            </h4>
                            <Badge className={getStatusColor(detection.status)}>
                              {detection.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCameraName(detection.camera_id)} • {detection.vehicle_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(detection.timestamp)} • Confidence: {(detection.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-muted-foreground">NEW</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <RiCarLine className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {isMonitoring ? 'Waiting for detections...' : 'Monitoring paused'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Health Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiSignalWifiLine className="h-5 w-5 text-green-600" />
              System Health Monitor
            </CardTitle>
            <CardDescription>
              Real-time system performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Processing Queue */}
              <div>
                <h4 className="font-medium mb-2">Processing Queue</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Low queue load</p>
                </div>
              </div>

              {/* Network Status */}
              <div>
                <h4 className="font-medium mb-2">Network Latency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average</span>
                    <span className="font-medium">{metrics.processingLatency}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Excellent connection</p>
                </div>
              </div>

              {/* Detection Accuracy */}
              <div>
                <h4 className="font-medium mb-2">Detection Accuracy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current</span>
                    <span className="font-medium">{metrics.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${metrics.accuracy}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">High accuracy rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiTimeLine className="h-5 w-5 text-blue-600" />
              Activity Timeline
            </CardTitle>
            <CardDescription>
              Recent system events and detections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveDetections.slice(0, 5).map((detection, index) => (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <RiCarLine className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      Vehicle detected: <span className="font-mono">{detection.license_plate}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getCameraName(detection.camera_id)} • {formatTime(detection.timestamp)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(detection.status)}>
                    {detection.status}
                  </Badge>
                </motion.div>
              ))}
              {liveDetections.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No recent activity to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}