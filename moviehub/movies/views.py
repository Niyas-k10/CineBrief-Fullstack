import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FavoriteMovie,Watchlist,RecentlyViewed
from .serializers import FavoriteMovieSerializer,WatchlistSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache


class MovieSearchView(APIView):

    def get(self, request):

        query = request.GET.get("q")
        page = request.GET.get("page", 1)

        url = f"{settings.TMDB_BASE_URL}/search/movie"

        params = {
            "api_key": settings.TMDB_API_KEY,
            "query": query,
            "page": page
        }

        response = requests.get(url, params=params)

        data = response.json()

        movies = []

        for movie in data.get("results", []):

            movies.append({
                "id": movie["id"],
                "title": movie["title"],
                "rating": movie["vote_average"],
                "release_date": movie["release_date"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
            })

        return Response({
            "success": True,
            "message": "Movies fetched successfully",
            "page": data.get("page"),
            "total_pages": data.get("total_pages"),
            "data": movies
        })


class TrendingMoviesView(APIView):

    def get(self, request):

        # Step 1 - Cache
        cached_movies = cache.get("trending_movies")

        if cached_movies:
            return Response({
                "success": True,
                "message": "Trending movies from cache",
                "data": cached_movies
            })

        # Step 2 - TMDB API
        url = f"{settings.TMDB_BASE_URL}/trending/movie/day"
        params = {
            "api_key": settings.TMDB_API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        movies = []

        for movie in data.get("results", []):

            poster = None
            backdrop = None

            if movie.get("poster_path"):
                poster = f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"

            if movie.get("backdrop_path"):
                backdrop = f"https://image.tmdb.org/t/p/original{movie['backdrop_path']}"

            movies.append({
                "id": movie.get("id"),
                "title": movie.get("title"),
                "poster": poster,
                "backdrop_path": backdrop,
                "overview": movie.get("overview"),
                "rating": movie.get("vote_average")
            })

        # Step 3 - Cache store
        cache.set("trending_movies", movies, timeout=600)

        return Response({
            "success": True,
            "message": "Trending movies from TMDB",
            "data": movies
        })


class MovieDetailView(APIView):

    def get(self, request, movie_id):

        url = f"{settings.TMDB_BASE_URL}/movie/{movie_id}"

        params = {
            "api_key": settings.TMDB_API_KEY
        }

        response = requests.get(url, params=params)

        data = response.json()

        return Response(data)

class AddFavoriteMovie(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        movie = FavoriteMovie.objects.create(
            user=request.user,
            movie_id=data["movie_id"],
            title=data["title"],
            poster_path=data.get("poster_path")
        )

        serializer = FavoriteMovieSerializer(movie)

        return Response(serializer.data)
    
class UserFavorites(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        movies = FavoriteMovie.objects.filter(user=request.user)

        serializer = FavoriteMovieSerializer(movies, many=True)

        return Response(serializer.data)

class RemoveFavorite(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):

        movie = FavoriteMovie.objects.filter(
            user=request.user,
            movie_id=movie_id
        )

        movie.delete()

        return Response({"message": "Movie removed from favorites"})

class MovieCastView(APIView):

    def get(self, request, movie_id):

        url = f"{settings.TMDB_BASE_URL}/movie/{movie_id}/credits"

        params = {
            "api_key": settings.TMDB_API_KEY
        }

        response = requests.get(url, params=params)

        data = response.json()

        cast_list = []

        for actor in data.get("cast", [])[:10]:   # first 10 actors

            cast_list.append({
                "name": actor["name"],
                "character": actor["character"],
                "profile_image": f"https://image.tmdb.org/t/p/w500{actor['profile_path']}" if actor["profile_path"] else None
            })

        return Response({
            "success": True,
            "message": "Movie cast fetched successfully",
            "data": cast_list
        })

class AddToWatchlist(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        movie = Watchlist.objects.create(
            user=request.user,
            movie_id=data["movie_id"],
            title=data["title"],
            poster_path=data.get("poster_path")
        )

        serializer = WatchlistSerializer(movie)

        return Response(serializer.data)

class UserWatchlist(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        movies = Watchlist.objects.filter(user=request.user)

        serializer = WatchlistSerializer(movies, many=True)

        return Response(serializer.data)


class RemoveFromWatchlist(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, movie_id):

        movie = Watchlist.objects.filter(
            user=request.user,
            movie_id=movie_id
        )

        movie.delete()

        return Response({"message": "Movie removed from watchlist"})


class MovieGenresView(APIView):

    def get(self, request):

        cache_key = "movie_genres"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        url = f"{settings.TMDB_BASE_URL}/genre/movie/list"

        params = {
            "api_key": settings.TMDB_API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        result = {
            "success": True,
            "message": "Genres fetched successfully",
            "data": data["genres"]
        }

        # ✅ Cache for 1 hour
        cache.set(cache_key, result, timeout=60 * 60)

        return Response(result)


class MoviesByGenreView(APIView):

    def get(self, request, genre_id):

        page = request.GET.get("page", 1)

        cache_key = f"genre_{genre_id}_page_{page}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        url = f"{settings.TMDB_BASE_URL}/discover/movie"

        params = {
            "api_key": settings.TMDB_API_KEY,
            "with_genres": genre_id,
            "page": page
        }

        response = requests.get(url, params=params)
        data = response.json()

        movies = []

        for movie in data.get("results", []):
            movies.append({
                "id": movie["id"],
                "title": movie["title"],
                "rating": movie["vote_average"],
                "release_date": movie["release_date"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
            })

        result = {
            "success": True,
            "page": data.get("page"),
            "total_pages": data.get("total_pages"),
            "data": movies
        }

        # ✅ Cache for 30 minutes
        cache.set(cache_key, result, timeout=60 * 30)

        return Response(result)

class PopularMoviesView(APIView):

    def get(self, request):

        page = request.GET.get("page", 1)

        cache_key = f"popular_movies_page_{page}"
        cached = cache.get(cache_key)

        if cached:
            print(" POPULAR FROM CACHE")
            return Response(cached)

        print("POPULAR FROM TMDB")

        url = f"{settings.TMDB_BASE_URL}/movie/popular"
        params = {
            "api_key": settings.TMDB_API_KEY,
            "page": page
        }

        response = requests.get(url, params=params)
        data = response.json()

        movies = []

        for movie in data.get("results", []):
            movies.append({
                "id": movie["id"],
                "title": movie["title"],
                "rating": movie["vote_average"],
                "release_date": movie["release_date"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
            })

        result = {
            "success": True,
            "data": movies
        }

        cache.set(cache_key, result, timeout=600)

        return Response(result)

class MovieRecommendationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        cache_key = f"recommendations_user_{user.id}"

        cached = cache.get(cache_key)

        if cached:
            print(" RECOMMENDATION FROM CACHE")
            return Response(cached)

        print(" RECOMMENDATION FROM TMDB")

        favorites = FavoriteMovie.objects.filter(user=user)[:5]

        if not favorites:
            url = f"{settings.TMDB_BASE_URL}/trending/movie/day"
            params = {"api_key": settings.TMDB_API_KEY}
            response = requests.get(url, params=params)
            data = response.json()

            movies = [
                {
                    "id": m["id"],
                    "title": m["title"],
                    "rating": m["vote_average"],
                    "poster": f"https://image.tmdb.org/t/p/w500{m['poster_path']}"
                }
                for m in data.get("results", [])[:10]
            ]

            result = {
                "success": True,
                "recommended_movies": movies
            }

            cache.set(cache_key, result, timeout=600)
            return Response(result)

        recommended_set = {}

        for fav in favorites:
            url = f"{settings.TMDB_BASE_URL}/movie/{fav.movie_id}/recommendations"
            params = {"api_key": settings.TMDB_API_KEY}

            response = requests.get(url, params=params)
            data = response.json()

            for movie in data.get("results", [])[:5]:
                recommended_set[movie["id"]] = {
                    "id": movie["id"],
                    "title": movie["title"],
                    "rating": movie["vote_average"],
                    "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
                }

        result = {
            "success": True,
            "recommended_movies": list(recommended_set.values())[:15]
        }

        cache.set(cache_key, result, timeout=600)

        return Response(result)


class SimilarMoviesView(APIView):

    def get(self, request, movie_id):

        page = request.GET.get("page", 1)

        url = f"{settings.TMDB_BASE_URL}/movie/{movie_id}/similar"

        params = {
            "api_key": settings.TMDB_API_KEY,
            "page": page
        }

        response = requests.get(url, params=params)

        data = response.json()

        movies = []

        for movie in data.get("results", []):

            movies.append({
                "id": movie["id"],
                "title": movie["title"],
                "rating": movie["vote_average"],
                "release_date": movie["release_date"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
            })

        return Response({
            "success": True,
            "page": data.get("page"),
            "total_pages": data.get("total_pages"),
            "data": movies
        })

    
class TopRatedMoviesView(APIView):

    def get(self, request):

        page = request.GET.get("page", 1)

        cache_key = f"top_rated_page_{page}"
        cached = cache.get(cache_key)

        if cached:
            print("⚡ TOP RATED FROM CACHE")
            return Response(cached)

        print("🐢 TOP RATED FROM TMDB")

        url = f"{settings.TMDB_BASE_URL}/movie/top_rated"
        params = {
            "api_key": settings.TMDB_API_KEY,
            "page": page
        }

        response = requests.get(url, params=params)
        data = response.json()

        movies = []

        for movie in data.get("results", []):
            movies.append({
                "id": movie["id"],
                "title": movie["title"],
                "rating": movie["vote_average"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie["poster_path"] else None
            })

        result = {
            "success": True,
            "data": movies
        }

        cache.set(cache_key, result, timeout=600)

        return Response(result)


class RecentlyViewedView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        movies = RecentlyViewed.objects.filter(user=request.user).order_by("-viewed_at")[:10]

        data = []

        for movie in movies:

            data.append({
                "movie_id": movie.movie_id,
                "title": movie.title,
                "poster": movie.poster_path
            })

        return Response({
            "success": True,
            "data": data
        })