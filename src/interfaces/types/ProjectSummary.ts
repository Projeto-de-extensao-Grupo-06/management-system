import type Client from './Client';

export default interface ProjectSummary {
  id: number;
  projectTitle: string;
  status: string;
 deadline: string | null;
  systemType: 'ON_GRID' | 'OFF_GRID' | null;
  responsible: {
  id: number;
  firstName: string;
  lastName: string;
};
  client: Client;
  commentCount: number;
  fileCount: number;
}
