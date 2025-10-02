import React, { useState, useEffect } from 'react';
import { Clock, Trash2, CheckCircle, XCircle, Loader, Play } from 'lucide-react';
import { getJobs, deleteJob } from '../services/api';
import ClipGallery from './ClipGallery';

interface Job {
  id: number;
  job_type: 'top_clips' | 'channel_highlights';
  config: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  created_at: string;
  completed_at?: string;
  output_file?: string;
}

const JobHistory: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleViewClips = (jobId: number) => {
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-quaternary" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader className="h-4 w-4 text-quaternary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-quaternary bg-tertiary';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-quaternary bg-tertiary';
      default:
        return 'text-primary bg-tertiary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary p-6">
        <div className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin text-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-secondary" />
        <h2 className="text-xl font-semibold text-primary">Job History</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8 text-primary">
          <Clock className="h-12 w-12 mx-auto mb-4 text-tertiary" />
          <p>No scraping jobs yet</p>
          <p className="text-sm">Start a scraping job to see results here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border border-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="text-sm text-primary">
                    {job.job_type === 'top_clips' ? 'Top Clips' : 'Channel Highlights'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'completed' && (
                    <button
                      onClick={() => handleViewClips(job.id)}
                      className="p-1 text-primary hover:text-secondary transition-colors"
                      title="View clips"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1 text-primary hover:text-red-600 transition-colors"
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {job.status === 'running' && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-primary mb-1">
                    <span>Progress</span>
                    <span>{job.progress}%</span>
                  </div>
                  <div className="w-full bg-tertiary rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {job.result && (
                <div className="text-sm text-primary mb-2">
                  <p>Total clips: {job.result.total_clips}</p>
                  {job.result.game_breakdown && (
                    <p>Games: {Object.keys(job.result.game_breakdown).length}</p>
                  )}
                  {job.result.channels && (
                    <p>Channels: {Object.keys(job.result.channels).length}</p>
                  )}
                </div>
              )}

              {job.error && (
                <div className="text-sm text-red-600 mb-2">
                  Error: {job.error}
                </div>
              )}

              <div className="text-xs text-primary">
                Started: {formatDate(job.created_at)}
                {job.completed_at && (
                  <span> • Completed: {formatDate(job.completed_at)}</span>
                )}
              </div>
              
              {/* Show ClipGallery when this job is selected */}
              {selectedJobId === job.id && job.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-secondary">
                  <ClipGallery jobId={job.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobHistory;
