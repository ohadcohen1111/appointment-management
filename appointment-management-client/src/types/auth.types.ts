export interface LoginDto {
    username: string;
    password: string;
  }
  
  export interface RegisterDto extends LoginDto {
    firstName: string;
  }
  