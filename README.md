# pdf-qa-app

This project is a PDF Quality Assurance application designed to streamline the process of validating and testing PDF documents. 

## Project Structure

The project is divided into two main parts: **backend** and **frontend**.

### Backend

The backend is built using Python and includes the following components:

- **app**: Contains the main application logic, including configuration, database interactions, models, schemas, services, and API endpoints.
- **prisma**: Contains the Prisma schema for database management.
- **uploads**: Directory for storing uploaded files.
- **requirements.txt**: Lists the Python dependencies required for the backend.
- **.env**: Environment variables for configuration.

### Frontend

The frontend is built using JavaScript and includes:

- **public**: Static files for the frontend application.
- **src**: Contains the main source code, including components, pages, and services.
- **package.json**: Lists the JavaScript dependencies required for the frontend.
- **.env**: Environment variables for frontend configuration.

## Getting Started

To get started with the project, clone the repository and install the necessary dependencies for both the backend and frontend.

### Backend Setup

1. Navigate to the `backend` directory.
2. Install the required Python packages using `pip install -r requirements.txt`.
3. Set up your environment variables in the `.env` file.
4. Run the application using `python -m app.main`.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the required JavaScript packages using `npm install`.
3. Start the frontend application using `npm start`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.