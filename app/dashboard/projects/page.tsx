'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { RiArrowRightLine, RiAddCircleLine } from 'react-icons/ri';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

// Define the Project type
interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: 'SUCCESS' | 'IN_PROGRESS' | 'PENDING';
  user_id: string;
  investment_required?: string;
  risk_level?: string;
  market_size?: string;
  executive_summary?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Query projects for the current user
        const { data, error } = await supabase
          .from('project')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setProjects(data as Project[]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your projects. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, supabase, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate time since last update
  const getTimeSinceUpdate = (dateString: string) => {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffInDays = Math.floor(
      (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };
  // Calculate project progress based on completion of fields
  const calculateProgress = (project: Project) => {
    const requiredFields = [
      'market_size',
      'executive_summary',
      'implementation_timeline',
    ];
    const completedFields = requiredFields.filter(
      (field) => !!project[field as keyof Project],
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      default:
        return 'Pending';
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
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            View and manage your business opportunity projects
          </p>
        </div>
        <Link href="/dashboard/new-project">
          <Button>
            <RiAddCircleLine className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-6">
        {loading ? (
          // Show loading skeleton if data is being fetched
          Array(3)
            .fill(0)
            .map(() => {
              // Generate a unique ID for each skeleton item
              const uniqueId = Math.random().toString(36).substr(2, 9);
              return (
                <motion.div
                  key={`loading-skeleton-${uniqueId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="animate-pulse">
                    <CardHeader className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
                      <div className="flex justify-between mt-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
        ) : projects.length > 0 ? (
          projects.map((project, index) => {
            const progress = calculateProgress(project);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card>
                  <CardHeader className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge
                            className={
                              project.status === 'SUCCESS'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : project.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            }
                          >
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">
                          Created on {formatDate(project.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Last updated:{' '}
                          {getTimeSinceUpdate(
                            project.updated_at || project.created_at,
                          )}
                        </div>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Project
                            <RiArrowRightLine className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to get started with GapMap AI.
                  </p>
                  <Link href="/dashboard/new-project">
                    <Button>
                      <RiAddCircleLine className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
