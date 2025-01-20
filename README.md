
# Appointment Management Application

Fullstack application for managing appointments, built with a React frontend and a C# ASP.NET Core backend.


### Client Setup (React)

#### 1. Navigate to the client folder:

```cd appointment-management-client```

#### 2.Install dependencies:

```npm install```

#### 2.Run the client in development mode:

```npm run dev```

### Backend Setup (C#)

#### 1. Navigate to the server folder:

```cd appointment-management-server```

#### 2.Restore dependencies:

```dotnet restore```

#### 3.Update the database connection string in appsettings.json:

```
"ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YOUR_DATABASE;User Id=YOUR_USER;Password=YOUR_PASSWORD;"
}
```

#### 4.Apply database migrations:

```dotnet ef database update```

#### 5.Run the backend:

```dotnet run```
