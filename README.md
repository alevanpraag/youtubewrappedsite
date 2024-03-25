# YouTube Rewind

Visit the website at [YouTube Rewind](https://youtube-rewind-410800.uc.r.appspot.com/).

## Overview
YouTube Rewind is a Django-React application that generates a personalized summary of your YouTube activity for the year 2023, utilizing your Google Takeout data. This app provides insights into your viewing habits, highlighting top videos, favorite categories, and more, for a unique reflection on your year on YouTube.

## Features
- Generates a detailed summary of YouTube viewing habits for 2023.
- Offers insights into top videos, categories, and viewing patterns.
- User-friendly: Easy process to upload Google Takeout data.

## Getting Started

### Prerequisites
Ensure you have Python 3.8 or higher and Node.js installed to run the Django backend and the React frontend, respectively.

### Installation
To set up YouTube Rewind on your local machine, follow these steps:

```bash
# Clone the repository
git clone <repository-url>

# Backend setup
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend setup
cd ../frontend
npm install
npm run dev
