# Django Backend Fix - TODO Steps

## Approved Plan Breakdown:
1. [x] Edit `backend/requirements.txt` to add `djangorestframework-simplejwt==5.3.1`
2. [x] Install dependencies
3. [ ] Run migrations: `python manage.py makemigrations && python manage.py migrate`
4. [ ] Create superuser if needed: `python manage.py createsuperuser`
5. [ ] Start server: `python manage.py runserver 8080`
6. [ ] Verify frontend/backend integration (CORS already enabled)
