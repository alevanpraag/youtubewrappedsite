# Generated by Django 4.2.8 on 2024-01-05 05:36

import api.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Analysis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_watch', models.CharField(max_length=100)),
                ('first_music', models.CharField(max_length=100)),
                ('most_watch', models.CharField(max_length=100)),
                ('top_three', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Wrapped',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=api.models.generate_unique_code, max_length=8, unique=True)),
                ('host', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=64)),
                ('file', models.FileField(upload_to='watch_history/jsons/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('count', models.IntegerField(default=0)),
                ('music_count', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_id', models.CharField(max_length=100)),
                ('title', models.CharField(max_length=100)),
                ('channel', models.CharField(max_length=100)),
                ('duration', models.CharField(max_length=64)),
                ('category', models.CharField(max_length=100)),
                ('thumbnail', models.CharField(max_length=100)),
                ('month', models.CharField(default='01', max_length=2)),
                ('wrap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='api.wrapped')),
            ],
        ),
        migrations.CreateModel(
            name='Month',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.CharField(max_length=100)),
                ('count', models.CharField(max_length=100)),
                ('wrap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='months', to='api.wrapped')),
            ],
        ),
    ]
