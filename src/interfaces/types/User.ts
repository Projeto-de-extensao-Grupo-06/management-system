export default interface User {
  firstName: string;
  lastName: string;
  authorities: string[];
  mainModule?: string;
}