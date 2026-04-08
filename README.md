# CineBrief-Fullstack
CineBrief – Movie Recommendation Platform is a full-stack movie discovery and recommendation web application built using React (Frontend) and Django REST Framework (Backend).

It provides users with an interactive UI to explore trending, popular, and top-rated movies, browse movies by genre, view detailed information including cast and similar movies, manage favorites, search movies, write reviews, and receive personalized recommendations.

The project uses React JS with Vite and custom CSS for the frontend, Django and Django REST Framework for the backend, TMDB API for movie data, and MySQL as the database, along with Git and REST APIs.
The project structure includes a moviehub folder for the Django backend and a moviehub-frontend folder for the React frontend.

To run the backend:

Navigate to the backend folder using cd moviehub
Create a virtual environment using python -m venv venv
Activate it using venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
Install dependencies using pip install -r requirements.txt
Create a .env file and configure variables such as SECRET_KEY, DEBUG, TMDB_API_KEY, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, and DB_PORT
Apply migrations using python manage.py makemigrations and python manage.py migrate
Optionally create a superuser using python manage.py createsuperuser
Run the server using python manage.py runserver (http://127.0.0.1:8000/⁠�)

To run the frontend:

Navigate to the frontend folder using cd moviehub-frontend
Install dependencies using npm install
Start the development server using npm run dev (http://localhost:5173/⁠�)
Optionally, the project can be run using Docker:
Build containers using docker-compose build
Run containers using docker-compose up
The application exposes API endpoints such as /movies/trending/, /movies/popular/, /movies/top-rated/, /movies/recommendations/, /movies/<id>/, /movies/<id>/cast/, and /movies/<id>/similar/.


This project is developed by Niyas
