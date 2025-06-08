'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  RiFilterLine,
  RiDownloadLine,
  RiSearchLine,
  RiCalendarLine,
  RiBarChartBoxLine,
  RiPieChartLine,
  RiLineChartLine,
  RiCarLine,
  RiTimeLine,
  RiCameraLine,
  RiEyeLine,
  RiRefreshLine,
  RiFileExcelLine,
  RiPrinterLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoreLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine
} from 'react-icons/ri';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Define types for detailed monitoring
interface DetailedLogEntry {
  id: number;
  license_plate: string;
  entry_time: string;
  exit_time?: string;
  duration?: number; 
  status: 'PARKED' | 'EXITED' | 'VIOLATION' | 'OVERSTAY';
  confidence: number;
  camera_id: string;
  camera_location: string;
  vehicle_type: 'Car' | 'Motorcycle' | 'Truck' | 'Bus';
  parking_fee?: number;
  payment_status?: 'PAID' | 'UNPAID' | 'FREE';
  violation_type?: string;
}

interface HourlyData {
  hour: string;
  entries: number;
  exits: number;
  occupancy: number;
}

interface VehicleTypeData {
  name: string;
  value: number;
  color: string;
}

interface CameraPerformance {
  camera_id: string;
  location: string;
  total_detections: number;
  accuracy_rate: number;
  uptime: number;
  last_detection: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DetailMonitoringPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<DetailedLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<DetailedLogEntry[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [vehicleTypeData, setVehicleTypeData] = useState<VehicleTypeData[]>([]);
  const [cameraPerformance, setCameraPerformance] = useState<CameraPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cameraFilter, setCameraFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('entry_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Mock data generation
  const generateMockData = () => {
    // Generate hourly data for the last 24 hours
    const hourlyMockData: HourlyData[] = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 3600000);
      hourlyMockData.push({
        hour: hour.getHours().toString().padStart(2, '0') + ':00',
        entries: Math.floor(Math.random() * 15) + 5,
        exits: Math.floor(Math.random() * 12) + 3,
        occupancy: Math.floor(Math.random() * 30) + 40,
      });
    }

    // Generate vehicle type distribution
    const vehicleTypeMockData: VehicleTypeData[] = [
      { name: 'Car', value: 156, color: '#0088FE' },
      { name: 'Motorcycle', value: 89, color: '#00C49F' },
      { name: 'Truck', value: 23, color: '#FFBB28' },
      { name: 'Bus', value: 12, color: '#FF8042' },
    ];

    // Generate camera performance data
    const cameraMockData: CameraPerformance[] = [
      {
        camera_id: 'CAM-001',
        location: 'Main Entrance',
        total_detections: 1247,
        accuracy_rate: 94.7,
        uptime: 99.2,
        last_detection: new Date(Date.now() - 300000).toISOString(),
      },
      {
        camera_id: 'CAM-002',
        location: 'Exit Gate',
        total_detections: 1156,
        accuracy_rate: 96.1,
        uptime: 98.8,
        last_detection: new Date(Date.now() - 180000).toISOString(),
      },
      {
        camera_id: 'CAM-003',
        location: 'Secondary Entrance',
        total_detections: 892,
        accuracy_rate: 91.3,
        uptime: 95.4,
        last_detection: new Date(Date.now() - 900000).toISOString(),
      },
      {
        camera_id: 'CAM-004',
        location: 'Parking Area 1',
        total_detections: 743,
        accuracy_rate: 93.8,
        uptime: 97.6,
        last_detection: new Date(Date.now() - 120000).toISOString(),
      },
    ];

    // Generate detailed log entries
    const logMockData: DetailedLogEntry[] = [];
    const plateNumbers = ['B 1234 ABC', 'B 5678 DEF', 'B 9012 GHI', 'B 3456 JKL', 'B 7890 MNO'];
    const vehicleTypes: ('Car' | 'Motorcycle' | 'Truck' | 'Bus')[] = ['Car', 'Motorcycle', 'Truck', 'Bus'];
    const statuses: ('PARKED' | 'EXITED' | 'VIOLATION' | 'OVERSTAY')[] = ['PARKED', 'EXITED', 'VIOLATION', 'OVERSTAY'];
    const cameras = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004'];
    const locations = ['Main Entrance', 'Exit Gate', 'Secondary Entrance', 'Parking Area 1'];

    for (let i = 0; i < 100; i++) {
      const entryTime = new Date(Date.now() - Math.random() * 86400000 * 7); // Last 7 days
      const duration = Math.floor(Math.random() * 480) + 30; // 30 mins to 8 hours
      const exitTime = Math.random() > 0.3 ? new Date(entryTime.getTime() + duration * 60000) : undefined;
      const status = exitTime ? (Math.random() > 0.9 ? 'VIOLATION' : 'EXITED') : (Math.random() > 0.8 ? 'OVERSTAY' : 'PARKED');
      const cameraIndex = Math.floor(Math.random() * cameras.length);

      logMockData.push({
        id: i + 1,
        license_plate: plateNumbers[Math.floor(Math.random() * plateNumbers.length)] + Math.floor(Math.random() * 1000),
        entry_time: entryTime.toISOString(),
        exit_time: exitTime?.toISOString(),
        duration: exitTime ? duration : undefined,
        status,
        confidence: 0.7 + Math.random() * 0.3,
        camera_id: cameras[cameraIndex],
        camera_location: locations[cameraIndex],
        vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        parking_fee: exitTime ? Math.floor(Math.random() * 20000) + 5000 : undefined,
        payment_status: exitTime ? (Math.random() > 0.1 ? 'PAID' : 'UNPAID') : undefined,
        violation_type: status === 'VIOLATION' ? ['Expired Ticket', 'No Payment', 'Unauthorized Area'][Math.floor(Math.random() * 3)] : undefined,
      });
    }

    return {
      hourlyData: hourlyMockData,
      vehicleTypeData: vehicleTypeMockData,
      cameraPerformance: cameraMockData,
      logs: logMockData.sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData();
      setHourlyData(mockData.hourlyData);
      setVehicleTypeData(mockData.vehicleTypeData);
      setCameraPerformance(mockData.cameraPerformance);
      setLogs(mockData.logs);
      setFilteredLogs(mockData.logs);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...logs];
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.camera_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(log => new Date(log.entry_time) >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.entry_time) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(log => new Date(log.entry_time) >= monthAgo);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Camera filter
    if (cameraFilter !== 'all') {
      filtered = filtered.filter(log => log.camera_id === cameraFilter);
    }

    // Vehicle type filter
    if (vehicleTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.vehicle_type === vehicleTypeFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof DetailedLogEntry];
      let bValue: any = b[sortBy as keyof DetailedLogEntry];

      if (sortBy === 'entry_time' || sortBy === 'exit_time') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchTerm, dateFilter, statusFilter, cameraFilter, vehicleTypeFilter, sortBy, sortOrder]);

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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PARKED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'EXITED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'VIOLATION':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'OVERSTAY':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PARKED':
        return <RiCarLine className="h-4 w-4" />;
      case 'EXITED':
        return <RiCheckLine className="h-4 w-4" />;
      case 'VIOLATION':
        return <RiAlertLine className="h-4 w-4" />;
      case 'OVERSTAY':
        return <RiTimeLine className="h-4 w-4" />;
      default:
        return <RiCarLine className="h-4 w-4" />;
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };  const exportToCSV = () => {
    try {
      const headers = [
        'ID',
        'License Plate',
        'Entry Time',
        'Exit Time',
        'Duration (minutes)',
        'Status',
        'Vehicle Type',
        'Camera ID',
        'Camera Location',
        'Confidence (%)',
        'Parking Fee (Rp)',
        'Payment Status',
        'Violation Type'
      ];

      const csvData = filteredLogs.map(log => [
        log.id,
        log.license_plate,
        new Date(log.entry_time).toLocaleString('id-ID'),
        log.exit_time ? new Date(log.exit_time).toLocaleString('id-ID') : '',
        log.duration || '',
        log.status,
        log.vehicle_type,
        log.camera_id,
        log.camera_location,
        (log.confidence * 100).toFixed(1),
        log.parking_fee ? log.parking_fee.toLocaleString('id-ID') : '',
        log.payment_status || '',
        log.violation_type || ''
      ]);

      // Create CSV content with UTF-8 BOM
      const csvContent = '\uFEFF' + [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => {
            const cellStr = String(cell);
            // Escape cells that contain commas, quotes, or newlines
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `alpr-monitoring-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: `CSV file with ${filteredLogs.length} records downloaded successfully.`,
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export CSV file. Please try again.',
        variant: 'destructive',
      });
    }
  };  const exportToExcel = () => {
    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for Excel
      const excelData = filteredLogs.map(log => ({
        'ID': log.id,
        'License Plate': log.license_plate,
        'Entry Date': new Date(log.entry_time).toLocaleDateString('id-ID'),
        'Entry Time': new Date(log.entry_time).toLocaleTimeString('id-ID'),
        'Exit Date': log.exit_time ? new Date(log.exit_time).toLocaleDateString('id-ID') : '',
        'Exit Time': log.exit_time ? new Date(log.exit_time).toLocaleTimeString('id-ID') : '',
        'Duration (minutes)': log.duration || '',
        'Status': log.status,
        'Vehicle Type': log.vehicle_type,
        'Camera ID': log.camera_id,
        'Camera Location': log.camera_location,
        'Confidence (%)': (log.confidence * 100).toFixed(1),
        'Parking Fee (Rp)': log.parking_fee || '',
        'Payment Status': log.payment_status || '',
        'Violation Type': log.violation_type || ''
      }));

      // Create worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 8 },   // ID
        { wch: 15 },  // License Plate
        { wch: 12 },  // Entry Date
        { wch: 10 },  // Entry Time
        { wch: 12 },  // Exit Date
        { wch: 10 },  // Exit Time
        { wch: 18 },  // Duration
        { wch: 12 },  // Status
        { wch: 15 },  // Vehicle Type
        { wch: 12 },  // Camera ID
        { wch: 18 },  // Camera Location
        { wch: 15 },  // Confidence
        { wch: 18 },  // Parking Fee
        { wch: 15 },  // Payment Status
        { wch: 18 }   // Violation Type
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ALPR Monitoring Data');
      
      // Generate filename with current date
      const filename = `alpr-monitoring-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write and download the file
      XLSX.writeFile(workbook, filename);

      toast({
        title: 'Export Successful',
        description: `Excel file with ${filteredLogs.length} records downloaded successfully.`,
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export Excel file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportData = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToExcel();
    }
  };

  const refreshData = async () => {
    setLoading(true);
    toast({
      title: 'Refreshing Data',
      description: 'Loading latest monitoring data...',
    });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateMockData();
      setHourlyData(mockData.hourlyData);
      setVehicleTypeData(mockData.vehicleTypeData);
      setCameraPerformance(mockData.cameraPerformance);
      setLogs(mockData.logs);
      setFilteredLogs(mockData.logs);
      
      toast({
        title: 'Data Refreshed',
        description: 'All monitoring data has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter('today');
    setStatusFilter('all');
    setCameraFilter('all');
    setVehicleTypeFilter('all');
    setSortBy('entry_time');
    setSortOrder('desc');
    setCurrentPage(1);
    
    toast({
      title: 'Filters Reset',
      description: 'All filters have been reset to default values.',
    });
  };

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 mt-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RiBarChartBoxLine className="h-8 w-8 text-blue-600" />
            Detail Monitoring & Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive ALPR system analytics, logs, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportData('excel')}>
            <RiFileExcelLine className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportData('csv')}>
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Export CSV
          </Button>          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RiRefreshLine className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </motion.div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hourly Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiLineChartLine className="h-5 w-5" />
                Hourly Traffic Trends
              </CardTitle>
              <CardDescription>
                Entry and exit patterns over the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="entries" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                    name="Entries"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="exits" 
                    stackId="1"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                    name="Exits"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiPieChartLine className="h-5 w-5" />
                Vehicle Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of detected vehicle types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiCameraLine className="h-5 w-5" />
              Camera Performance Analytics
            </CardTitle>
            <CardDescription>
              Real-time performance metrics for all ALPR cameras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cameraPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="camera_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_detections" fill="#8884d8" name="Total Detections" />
                <Bar dataKey="accuracy_rate" fill="#82ca9d" name="Accuracy Rate %" />
                <Bar dataKey="uptime" fill="#ffc658" name="Uptime %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiFilterLine className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="License plate, camera..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PARKED">Parked</SelectItem>
                    <SelectItem value="EXITED">Exited</SelectItem>
                    <SelectItem value="VIOLATION">Violation</SelectItem>
                    <SelectItem value="OVERSTAY">Overstay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Camera</Label>
                <Select value={cameraFilter} onValueChange={setCameraFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cameras</SelectItem>
                    <SelectItem value="CAM-001">CAM-001 (Main)</SelectItem>
                    <SelectItem value="CAM-002">CAM-002 (Exit)</SelectItem>
                    <SelectItem value="CAM-003">CAM-003 (Secondary)</SelectItem>
                    <SelectItem value="CAM-004">CAM-004 (Area 1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vehicle Type</Label>
                <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  <RiRefreshLine className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>ALPR Detection Logs</CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} entries
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RiPrinterLine className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RiMoreLine className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('license_plate')}
                    >
                      <div className="flex items-center gap-2">
                        License Plate
                        {sortBy === 'license_plate' && (
                          sortOrder === 'asc' ? <RiArrowUpLine className="h-4 w-4" /> : <RiArrowDownLine className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('entry_time')}
                    >
                      <div className="flex items-center gap-2">
                        Entry Time
                        {sortBy === 'entry_time' && (
                          sortOrder === 'asc' ? <RiArrowUpLine className="h-4 w-4" /> : <RiArrowDownLine className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Camera</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('confidence')}
                    >
                      <div className="flex items-center gap-2">
                        Confidence
                        {sortBy === 'confidence' && (
                          sortOrder === 'asc' ? <RiArrowUpLine className="h-4 w-4" /> : <RiArrowDownLine className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(10).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : currentLogs.length > 0 ? (
                    currentLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-mono font-semibold">
                            {log.license_plate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatDate(log.entry_time)}</div>
                            <div className="text-sm text-muted-foreground">{formatTime(log.entry_time)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.exit_time ? (
                            <div>
                              <div className="font-medium">{formatDate(log.exit_time)}</div>
                              <div className="text-sm text-muted-foreground">{formatTime(log.exit_time)}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={log.duration && log.duration > 240 ? "text-orange-600 font-medium" : ""}>
                            {formatDuration(log.duration)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(log.status)}
                              {log.status}
                            </span>
                          </Badge>
                          {log.violation_type && (
                            <div className="text-xs text-red-600 mt-1">
                              {log.violation_type}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <RiCarLine className="h-4 w-4 text-muted-foreground" />
                            {log.vehicle_type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.camera_id}</div>
                            <div className="text-sm text-muted-foreground">{log.camera_location}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              log.confidence >= 0.9 ? 'bg-green-500' :
                              log.confidence >= 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-medium">
                              {(log.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.parking_fee ? (
                            <div>
                              <div className="font-medium">
                                Rp {log.parking_fee.toLocaleString()}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  log.payment_status === 'PAID' 
                                    ? 'border-green-500 text-green-700' 
                                    : log.payment_status === 'UNPAID'
                                    ? 'border-red-500 text-red-700'
                                    : 'border-gray-500 text-gray-700'
                                }`}
                              >
                                {log.payment_status}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <RiCarLine className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No entries found matching your filters</p>                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetFilters}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <RiCarLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                {((filteredLogs.length / logs.length) * 100).toFixed(1)}% of all records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Currently Parked
              </CardTitle>
              <RiTimeLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredLogs.filter(log => log.status === 'PARKED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active vehicles in area
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Violations
              </CardTitle>
              <RiAlertLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {filteredLogs.filter(log => log.status === 'VIOLATION' || log.status === 'OVERSTAY').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Confidence
              </CardTitle>
              <RiEyeLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredLogs.length > 0 
                  ? ((filteredLogs.reduce((sum, log) => sum + log.confidence, 0) / filteredLogs.length) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Detection accuracy rate
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for monitoring operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <RiAlertLine className="h-6 w-6 text-red-500" />
                <span className="font-medium">View Violations</span>
                <span className="text-xs text-muted-foreground">Check all violations</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <RiTimeLine className="h-6 w-6 text-orange-500" />
                <span className="font-medium">Overstay Alerts</span>
                <span className="text-xs text-muted-foreground">Vehicles over time limit</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <RiCameraLine className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Camera Status</span>
                <span className="text-xs text-muted-foreground">Check camera health</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <RiFileExcelLine className="h-6 w-6 text-green-500" />
                <span className="font-medium">Generate Report</span>
                <span className="text-xs text-muted-foreground">Export detailed analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}