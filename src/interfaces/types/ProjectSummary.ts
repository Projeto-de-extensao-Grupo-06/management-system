import type Client from './Client';

export default interface ProjectSummary {
  id: number;
  projectTitle: string;
  status: string;
  nextSchedule: string | null;
  responsible: {
    id: number;
    name: string;
  };
  client: Client;
  commentCount: number;
  fileCount: number;
}
