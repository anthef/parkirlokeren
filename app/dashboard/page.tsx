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
import { RiAddCircleLine, RiArrowRightLine } from 'react-icons/ri';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';

// Define the Project type
interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: 'SUCCESS' | 'IN_PROGRESS' | 'CANCELLED';
  user_id: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase client
  const supabase = createClient();

  useEffect(() => {
    const successMessage = searchParams.get('success');
    if (successMessage) {
      toast({
        title: `Welcome back ${user?.email}`,
        description: decodeURIComponent(successMessage),
      });
    }
  }, [searchParams, toast, user]);

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

  return (
    <div className="space-y-6 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! {user?.email} Here's an overview of your business
            opportunities.
          </p>
        </div>
        <Link href="/dashboard/new-project">
          <Button>
            <RiAddCircleLine className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Projects',
            value: projects.length.toString(),
            change: `${
              projects.length > 0 ? '+' + projects.length : '0'
            } since last month`,
            icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
          },
          {
            title: 'Active Projects',
            value: projects
              .filter((p) => p.status === 'IN_PROGRESS')
              .length.toString(),
            change: 'Updated today',
            icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
          },
          {
            title: 'Completed Projects',
            value: projects
              .filter((p) => p.status === 'SUCCESS')
              .length.toString(),
            change: 'Updated today',
            icon: 'M2 10h20M2 14h20M2 18h20M2 6h20',
          },
          {
            title: 'Success Rate',
            value:
              projects.length > 0
                ? Math.round(
                    (projects.filter((p) => p.status === 'SUCCESS').length /
                      projects.length) *
                      100,
                  ) + '%'
                : '0%',
            change: 'Based on completion rate',
            icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: `<path d="${stat.icon}" />`,
                  }}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold tracking-tight mb-4">
          {loading ? 'Loading Projects...' : 'Recent Projects'}
        </h2>
        <div className="grid gap-4">
          {loading ? (
            // Show loading skeleton if data is being fetched
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
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="mt-4 flex justify-end">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
          ) : projects.length > 0 ? (
            // Show actual projects
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{project.title}</CardTitle>
                      <div
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : project.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}
                      >
                        {project.status === 'SUCCESS'
                          ? 'Completed'
                          : project.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : 'Cancelled'}
                      </div>
                    </div>
                    <CardDescription>
                      Created on {formatDate(project.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <RiArrowRightLine className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            // Show message when no projects
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">
                      No projects yet
                    </h3>
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
      </motion.div>
    </div>
  );
}
